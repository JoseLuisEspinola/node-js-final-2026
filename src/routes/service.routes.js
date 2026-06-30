import express from "express";
import {
  createService,
  getService,
  gerServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas accesibles para todos los usuarios autenticados
router.get("/", authMiddleware, getServices);
router.get("/:id", authMiddleware, getServiceById);

// Rutas restringidas solo para admin
router.post("/", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}, createService);

router.put("/:id", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}, updateService);

router.delete("/:id", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}, deleteService);

export default router;
