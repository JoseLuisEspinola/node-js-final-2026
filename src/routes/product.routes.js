import express from "express";
import ProductController from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Crear producto (solo admin)
router.post("/", authMiddleware, ProductController.createProduct);

// Obtener todos los productos
router.get("/", ProductController.getProducts);

// Obtener un producto por ID
router.get("/:id", ProductController.getProduct);

// Actualizar producto (solo admin)
router.put("/:id", authMiddleware, ProductController.updateProduct);

// Baja lógica de producto (solo admin)
router.delete("/:id", authMiddleware, ProductController.deleteProduct);

export default router;
