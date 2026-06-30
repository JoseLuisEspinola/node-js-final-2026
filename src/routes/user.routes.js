import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

// Endpoints CRUD de usuarios
router.post("/users", UserController.createUser);      // Crear usuario
router.get("/users", UserController.getUsers);         // Listar usuarios
router.get("/users/:id", UserController.getUser);      // Obtener usuario por ID
router.put("/users/:id", UserController.updateUser);   // Actualizar usuario
router.delete("/users/:id", UserController.deleteUser);// Baja lógica de usuario

export default router;
