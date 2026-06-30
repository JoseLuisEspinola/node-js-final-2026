import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

/* -Controlador de Usuarios, -CRUD completo: create, read, update, delete */
const UserController = {
  // Crear usuario (admin o cliente)
  async createUser(req, res) {
    try {
      const { name, email, password, rol = "cliente", notasCliente = "" } = req.body;

      // Validar que solo un admin pueda crear otro admin
      if (rol === "admin" && req.user?.rol !== "admin") {
        return res.status(403).json({ message: "Solo un administrador puede crear otro administrador" });
      }

      // Validación básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        name,
        email,
        password: hashedPassword,
        rol,
        activo: true,
        notasCliente,
        creadoEn: new Date(),
        actualizadoEn: new Date()
      };

      // el modelo se encargará de asignar el ID automáticamente
      const newUser = await UserModel.createUser(userData);

      // No devolver el password en la respuesta
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un usuario por ID
  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getUser(id);

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Listar usuarios
  async getUsers(req, res) {
    try {
      const users = await UserModel.getUsers();

      // Si es cliente, solo ve su propio usuario
      if (req.user?.rol === "cliente") {
        const ownUser = users.find(u => u.id === req.user.id);
        return res.json(ownUser ? [ownUser] : []);
      }

      // Si es admin, ve todos
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validación de permisos
      if (req.user?.rol !== "admin" && req.user?.id !== id) {
        return res.status(403).json({ message: "No tienes permisos para modificar este usuario" });
      }

      // Si viene un password en la actualización, encriptarlo
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updatedUser = await UserModel.updateUser(id, updates);


      // No devolver el password en la respuesta
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);

      //res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Baja lógica de usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Validación de permisos
      if (req.user?.rol !== "admin" && req.user?.id !== id) {
        return res.status(403).json({ message: "No tienes permisos para dar de baja este usuario" });
      }

      const deletedUser = await UserModel.deleteUser(id);
      res.json({ message: "Usuario dado de baja", ...deletedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default UserController;
