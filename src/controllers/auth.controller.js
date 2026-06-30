import jwt from "jsonwebtoken";
import db from "../config/firebase.js";
import UserModel from "../models/user.model.js";
import { hashPassword, comparePassword } from "../services/password.service.js";

const AuthController = {
  /* login */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const snapshot = await db.collection("users").where("email", "==", email).get();

      if (snapshot.empty) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const userDoc = snapshot.docs[0];
      const user = { id: userDoc.id, ...userDoc.data() };

      // Validar password con bcrypt
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      // Leer la clave justo acá (ya disponible porque dotenv.config() corrió en index.js)
      const SECRET_KEY = process.env.JWT_SECRET;
      console.log("JWT_SECRET en login en auth", SECRET_KEY);

      // Generar token con datos básicos
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /* registro */
  async register(req, res) {
    try {
      const { id, name, email, password, rol = "cliente" } = req.body;

      // Encriptar contraseña antes de guardar
      const hashedPassword = await hashPassword(password);

      const newUserData = {
        name,
        email,
        password: hashedPassword,
        rol,                // cliente o admin
        activo: true,
        notasCliente: "",
        creadoEn: new Date(),
        actualizadoEn: new Date()
      };

      // Usamos el modelo para crear el usuario en Firestore
      const newUser = await UserModel.createUser(newUserData);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default AuthController;
