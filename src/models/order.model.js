import db from "../config/firebase.js";

const OrderModel = {
  // Crear una nueva orden al confirmar el checkout
  async createOrder(data) {
    const orderData = {
      ...data,
      createdAt: new Date()
    };
    const docRef = await db.collection("orders").add(orderData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  // Obtener todas las órdenes de un usuario
  async getOrdersByUser(userId) {
    const snapshot = await db.collection("orders")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Obtener una orden específica por ID
  async getOrderById(orderId) {
    const doc = await db.collection("orders").doc(orderId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
};

export default OrderModel;
