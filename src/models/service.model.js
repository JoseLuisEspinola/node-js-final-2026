import { db } from "jsonwebtoken";

const ServiceModel = {
  // Crear un nuevo servicio con validaciones y log
  async create(serviceData, adminId) {
    if (!serviceData.descripcion || serviceData.descripcion.trim() === "") {
      throw new Error("La descripción no puede estar vacía");
    }
    if (typeof serviceData.precio !== "number" || serviceData.precio <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
    if (typeof serviceData.duracion !== "number" || serviceData.duracion <= 0) {
      throw new Error("La duración debe ser un número positivo en minutos");
    }

    const docRef = await db.collection("services").add({
      ...serviceData,
      activo: true,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      creadoPor: adminId, // auditoría
    });
    return { id: docRef.id, ...serviceData };
  },

  async getAll() {
    const snapshot = await db.collection("services").where("activo", "==", true).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const doc = await db.collection("services").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, serviceData, adminId) {
    // Validación de precio
    if (
      serviceData.precio !== undefined &&
      (typeof serviceData.precio !== "number" || serviceData.precio <= 0)
    ) {
      throw new Error("El precio debe ser un número positivo");
    }

    // Validación de descripción
    if (
      serviceData.descripcion !== undefined &&
      (serviceData.descripcion.trim() === "")
    ) {
      throw new Error("La descripción no puede estar vacía");
    }

    // Validación de duración
    if (
      serviceData.duracion !== undefined &&
      (typeof serviceData.duracion !== "number" || serviceData.duracion <= 0)
    ) {
      throw new Error("La duración debe ser un número positivo en minutos");
    }

    await db.collection("services").doc(id).update({
      ...serviceData,
      actualizadoEn: new Date().toISOString(),
      actualizadoPor: adminId, // auditoría
    });

    const updatedDoc = await db.collection("services").doc(id).get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Soft delete: marcar activo = false
  async delete(id, adminId) {
    await db.collection("services").doc(id).update({
      activo: false,
      actualizadoEn: new Date().toISOString(),
      actualizadoPor: adminId, // auditoría
    });
    return { message: "Servicio desactivado correctamente" };
  }
};

export default ServiceModel;
