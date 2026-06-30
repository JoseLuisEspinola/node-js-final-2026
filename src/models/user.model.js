import db from "../config/firebase.js";

const UserModel = {
  // Crear usuario con ID incremental
  async createUser(data) {
    const snapshot = await db.collection("users")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    let nextId = 1;
    if (!snapshot.empty) {
      const lastUser = snapshot.docs[0].data();
      const lastIdNum = parseInt(lastUser.id, 10);
      nextId = lastIdNum + 1;
    }

    const userData = {
      id: String(nextId),
      name: data.name,
      email: data.email,
      password: data.password,
      rol: data.rol || "cliente",   // por defecto cliente
      activo: data.activo !== undefined ? data.activo : true,
      notasCliente: data.notasCliente || "",
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };

    await db.collection("users").doc(String(nextId)).set(userData);
    return userData;
  },

  // Obtener un usuario por ID
  async getUser(id) {
    const doc = await db.collection("users").doc(String(id)).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Listar todos los usuarios (activos e inactivos)
  async getUsers() {
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Actualizar usuario
  async updateUser(id, updates) {
    const updatedData = {
      ...updates,
      actualizadoEn: new Date()
    };
    await db.collection("users").doc(String(id)).update(updatedData);

    const updatedDoc = await db.collection("users").doc(String(id)).get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Baja lógica de usuario (activo = false)
  async deleteUser(id) {
    const updatedData = {
      activo: false,
      actualizadoEn: new Date()
    };
    await db.collection("users").doc(String(id)).update(updatedData);

    const deletedDoc = await db.collection("users").doc(String(id)).get();
    return { id: deletedDoc.id, ...deletedDoc.data() };
  }
};

export default UserModel;
