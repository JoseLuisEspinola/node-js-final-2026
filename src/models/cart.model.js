import db from "../config/firebase.js"; 
// 👉 Lo pongo porque necesito la conexión a Firestore para leer y escribir datos del carrito.

const CartModel = {
  async getCart(userId) {
    // Lo pongo porque cada usuario tiene su propio carrito identificado por su userId.
    const doc = await db.collection("carts").doc(userId).get();
    // Lo pongo porque busco el documento del carrito en la colección "carts" de Firestore.

    return doc.exists ? doc.data() : { items: [] };
    // Lo pongo porque si el carrito existe, devuelvo sus datos; 
    // si no existe, devuelvo un carrito vacío con items: [].
  },

  async saveCart(userId, cartData) {
    // Lo pongo porque necesito guardar o actualizar el carrito de un usuario específico.
    await db.collection("carts").doc(userId).set(cartData, { merge: true });
    // Lo pongo porque uso `.set` con `{ merge: true }` para actualizar el carrito 
    // sin sobrescribir completamente el documento (mantiene otros campos si los hubiera).

    return cartData;
    // Lo pongo porque devuelvo el carrito actualizado para confirmación.
  }
};

export default CartModel; 
// Lo pongo porque necesito exportar el modelo para usarlo en el controlador del carrito.
