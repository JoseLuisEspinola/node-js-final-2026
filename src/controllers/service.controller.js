import ServiceModel from "../models/service.model.js";

// Crear un nuevo servicio (solo admin)
const createService = async (req, res) => {
  try {
    const serviceData = req.body;
    const adminId = req.user.id; // tomado del middleware de auth
    const newService = await ServiceModel.create(serviceData, adminId);
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los servicios (clientes y admin)
const getServices = async (req, res) => {
  try {
    const services = await ServiceModel.getAll();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ message: "Error al obtener servicios" });
  }
};

// Obtener un servicio por ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.getById(id);
    if (!service || !service.activo) {
      return res.status(404).json({ message: "Servicio no encontrado o inactivo" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error al obtener servicio:", error);
    res.status(500).json({ message: "Error al obtener servicio" });
  }
};

// Actualizar un servicio (solo admin)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceData = req.body;
    const adminId = req.user.id;
    const updatedService = await ServiceModel.update(id, serviceData, adminId);
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(400).json({ message: error.message });
  }
};

// Eliminar (soft delete) un servicio (solo admin)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const result = await ServiceModel.delete(id, adminId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al desactivar servicio:", error);
    res.status(500).json({ message: "Error al desactivar servicio" });
  }
};

export default {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
