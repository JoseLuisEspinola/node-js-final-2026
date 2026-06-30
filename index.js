import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRoutes from "./src/routes/order.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

// Carga de varibles de entorno
dotenv.config({ path: "./.env", override: true });
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Importar rutas
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
// ruta del carrito
import cartRoutes from "./src/routes/cart.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import authMiddleware from "./src/middleware/auth.middleware.js";

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

// Rutas de autenticación (no requieren token)
app.use("/auth", authRoutes);

// Rutas de usuarios (protegidas con JWT)
app.use("/api", authMiddleware, userRoutes);

// Rutas del carrito (protegido con JWT)
app.use("/api/cart", authMiddleware, cartRoutes);

// Rutas de productos
app.use("/api/products", productRoutes);

// Rutas de órdenes (protegidas con JWT)
app.use("/api/orders", authMiddleware, ordersRoutes);


// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor funcionando!!!");
});

// Middleware 404 (rutas no encontradas)
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
