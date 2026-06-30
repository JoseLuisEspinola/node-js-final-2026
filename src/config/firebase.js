import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;

try {
  // Intentar leer el archivo local
  serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
} catch (err) {
  // Si no existe, usar variables de entorno (Vercel)
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
}

// Inicializar SIEMPRE fuera del try
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export default db;

