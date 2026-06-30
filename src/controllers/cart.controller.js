import { Timestamp } from "firebase-admin/firestore";
import CartModel from "../models/cart.model.js";
// 👉 Agrego esta línea porque necesito acceder al modelo de productos para validar stock y actualizarlo.
import ProductModel from "../models/product.model.js"; 
// Importo el modelo de ordenes
import OrderModel from "../models/order.model.js";

const CartController = {
  async createCart(req, res) {
    try {
      const userId = req.user.id;
      // 👉 El carrito está asociado al usuario logueado.

      const cartData = {
        userId,
        items: [],
        activo: true,
        creadoEn: new Date(),
        actualizadoEn: new Date()
      };

      await CartModel.saveCart(userId, cartData);
      // 👉 Guardo el carrito vacío en Firestore usando el modelo.

      res.status(201).json(cartData);
      // 👉 Devuelvo el carrito recién creado.
    } catch (error) {
      res.status(500).json({ error: error.message });
      // 👉 Manejo errores.
    }
  },

  async getCart(req, res) {
    try {
      const userId = req.user.id; 
      // 👉 El carrito está asociado al usuario logueado.

      const cart = await CartModel.getCart(userId); 
      // 👉 Traigo el carrito desde Firestore.

      res.json(cart); 
      // 👉 Devuelvo el carrito al cliente.
    } catch (error) {
      res.status(500).json({ error: error.message }); 
      // 👉 Manejo errores.
    }
  },

  async addItem(req, res) {
    try {
      const userId = req.user.id; 
      // 👉 Necesito saber a qué usuario pertenece el carrito.

      const { productId } = req.body; 
      // 👉 El cliente envía el ID del producto que quiere agregar.

      const product = await ProductModel.getProduct(productId); 
      // 👉 Verifico que el producto exista y conozco su stock.

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" }); 
      }

      if (product.stock <= 0) {
        return res.status(400).json({ message: "Sin stock disponible" }); 
      }

      const cart = await CartModel.getCart(userId); 
      // 👉 Traigo el carrito actual del usuario.

      const existing = cart.items.find(item => item.productId === productId); 
      // 👉 Verifico si el producto ya está en el carrito.

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          return res.status(400).json({ message: "Stock insuficiente" }); 
        }
        existing.quantity += 1; 
      } else {
        cart.items.push({ productId, name: product.name, price: product.price, quantity: 1 }); 
      }

      await CartModel.saveCart(userId, cart); 
      // 👉 Guardo el carrito actualizado en Firestore.

      res.json(cart); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  },

  async updateQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const product = await ProductModel.getProduct(productId);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      if (quantity > product.stock) return res.status(400).json({ message: "Stock insuficiente" });

      const cart = await CartModel.getCart(userId);
      const item = cart.items.find(i => i.productId === productId);
      if (!item) return res.status(404).json({ message: "Producto no está en el carrito" });

      item.quantity = quantity;

      await CartModel.saveCart(userId, cart);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const cart = await CartModel.getCart(userId);
      cart.items = cart.items.filter(item => item.productId !== productId);

      await CartModel.saveCart(userId, cart);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  async checkout(req, res) {
    try {
      const userId = req.user.id; 
      // 👉 El checkout es por usuario logueado.

      const cart = await CartModel.getCart(userId); 
      // 👉 Necesito saber qué productos quiere comprar.

      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" }); 
      }

      // 👉 Verifico stock real de cada producto.
      for (const item of cart.items) {
        const product = await ProductModel.getProduct(item.productId); 

        if (!product) {
          return res.status(404).json({ message: `Producto ${item.productId} no encontrado` }); 
        }

        if (item.quantity > product.stock) {
          return res.status(400).json({ message: `Stock insuficiente para ${product.name}` }); 
        }

        // 👉 Actualizo el stock en Firestore.
        const newStock = product.stock - item.quantity; 
        await ProductModel.updateStock(item.productId, newStock); 
      }

      // 🔹 Crear orden en historial
      await OrderModel.createOrder({
        userId,
        items: cart.items,
        totalAmount: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdAt: Timestamp.now(),
        status: "confirmed"
      });

      // 👉 Después de la compra el carrito queda vacío.
      cart.items = []; 
      // 👉 Guardo el carrito vacío en Firestore.
      await CartModel.saveCart(userId, cart); 

      res.json({ message: "Compra confirmada y stock actualizado" }); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  }
};

export default CartController;
