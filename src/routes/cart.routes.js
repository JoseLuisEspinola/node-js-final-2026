// Lo pongo porque necesito crear el router de Express.
import express from "express"; 
// Lo pongo porque todas las rutas del carrito deben estar protegidas: 
// solo usuarios logueados pueden acceder.
import authMiddleware from "../middleware/auth.middleware.js"; 
// Lo pongo porque necesito usar los métodos que definimos en el controlador del carrito.
import CartController from "../controllers/cart.controller.js"; 
// Lo pongo porque creo una instancia de router para definir las rutas del carrito.
const router = express.Router(); 

// Lo pongo porque esta ruta crea el carrito vacío para el usuario logueado.
router.post("/", authMiddleware, CartController.createCart); 

// Lo pongo porque esta ruta devuelve el carrito del usuario logueado.
router.get("/", authMiddleware, CartController.getCart); 

// Lo pongo porque esta ruta permite agregar productos al carrito del usuario logueado.
router.post("/add", authMiddleware, CartController.addItem); 

// Actualizar cantidad de un producto
router.put("/update", authMiddleware, CartController.updateQuantity);

// Eliminar un producto del carrito
router.delete("/remove/:productId", authMiddleware, CartController.removeItem);


// Lo pongo porque esta ruta confirma la compra, actualiza stock y vacía el carrito. 
// Es nueva y corresponde al método que agregamos en el controlador.
router.post("/checkout", authMiddleware, CartController.checkout); 

// Lo pongo porque necesito exportar el router para usarlo en `app.js` o `server.js`.
export default router; 

