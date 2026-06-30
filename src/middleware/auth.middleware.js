import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // guardamos los datos del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
}

export default authMiddleware;
