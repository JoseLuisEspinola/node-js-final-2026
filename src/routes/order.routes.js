import express from "express";
import OrderModel from "../models/order.model.js";

const router = express.Router();

// Obtener todas las órdenes del usuario logueado
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await OrderModel.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una orden específica por ID
router.get("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
