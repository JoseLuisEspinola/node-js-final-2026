import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

// Ruta de registro
router.post("/register", AuthController.register);

// Ruta de login
router.post("/login", AuthController.login);

export default router;
