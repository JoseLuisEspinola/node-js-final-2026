import express from "express";
import db from "../config/firebase.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Middleware para validar rol admin
function isAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo admin" });
  }
  next();
}

// Obtener todos los carritos con productos (ignora vacíos)
router.get("/carts", authMiddleware, isAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("carts").get();
    const carts = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          creadoEn: data.creadoEn?.toDate().toISOString(),
          actualizadoEn: data.actualizadoEn?.toDate().toISOString()
        };
      })
      .filter(cart => cart.items && cart.items.length > 0);

    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las órdenes del sistema
router.get("/orders", authMiddleware, isAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      };
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
