import db from "../config/firebase.js";

const ProductModel = {
  // Crear producto con ID incremental
  async createProduct(data) {
    const snapshot = await db.collection("products")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    let nextId = 1;
    if (!snapshot.empty) {
      const lastProduct = snapshot.docs[0].data();
      const lastIdNum = parseInt(lastProduct.id, 10);
      nextId = lastIdNum + 1;
    }

    const productData = {
      id: String(nextId),              
      name: data.name,
      price: Number(parseFloat(data.price).toFixed(2)), 
      stock: data.stock,
      description: data.description,
      imageUrl: data.imageUrl,
      activo: data.activo !== undefined ? data.activo : true,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };

    await db.collection("products").doc(String(nextId)).set(productData);
    return productData;
  },

  // Obtener producto por ID
  async getProduct(id) {
    const doc = await db.collection("products").doc(String(id)).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Listar todos los productos
  async getProducts() {
    const snapshot = await db.collection("products").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Actualizar producto
  async updateProduct(id, updates) {
    const updatedData = {
      ...updates,
      actualizadoEn: new Date()
    };
    await db.collection("products").doc(String(id)).update(updatedData);

    const updatedDoc = await db.collection("products").doc(String(id)).get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Baja lógica de producto (activo = false)
  async deleteProduct(id) {
    const updatedData = {
      activo: false,
      actualizadoEn: new Date()
    };
    await db.collection("products").doc(String(id)).update(updatedData);

    const deletedDoc = await db.collection("products").doc(String(id)).get();
    return { id: deletedDoc.id, ...deletedDoc.data() };
  },

  // 🔹 Actualizar stock de producto (usado en checkout)
  async updateStock(id, newStock) {
    const updatedData = {
      stock: newStock,
      actualizadoEn: new Date()
    };
    await db.collection("products").doc(String(id)).update(updatedData);

    const updatedDoc = await db.collection("products").doc(String(id)).get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }
};

export default ProductModel;
