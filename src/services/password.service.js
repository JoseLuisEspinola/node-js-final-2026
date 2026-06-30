import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Generar hash seguro de la contraseña
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

// Comparar contraseña ingresada con el hash guardado
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { hashPassword, comparePassword };
