import ProductModel from "../models/product.model.js";

const ProductController = {
  async createProduct(req, res) {
    try {
      const { name, price, stock, description = "", imageUrl = "" } = req.body;

      if (!name || !price || !stock || !description || !imageUrl) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }

      // Normalizar precio con 2 decimales
      const finalPrice = Number(parseFloat(price).toFixed(2));

      // Si no viene imageUrl, asignamos un placeholder
      const finalImageUrl = imageUrl && imageUrl.trim() !== ""
      ? imageUrl
      : "https://via.placeholder.com/300x300?text=Producto+sin+imagen";

      const productData = {
        name,
        price: finalPrice,
        stock,
        description,
        imageUrl: finalImageUrl,
        creadoEn: new Date(),
        actualizadoEn: new Date()
      };

      const newProduct = await ProductModel.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getProduct(id);

      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProducts(req, res) {
    try {
      const products = await ProductModel.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Normalizar precio si viene en la actualización
      if (updates.price) {
        updates.price = Number(parseFloat(updates.price).toFixed(2));
      }

      // Si viene imageUrl vacío, asignar placeholder
      if (updates.imageUrl !== undefined) {
        updates.imageUrl = updates.imageUrl && updates.imageUrl.trim() !== ""
          ? updates.imageUrl
          : "https://via.placeholder.com/300x300?text=Producto+sin+imagen";
    }
      const updatedProduct = await ProductModel.updateProduct(id, {
        ...updates,
        actualizadoEn: new Date()
      });

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductModel.deleteProduct(id);
      res.json({ message: "Producto dado de baja", ...deletedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default ProductController;
