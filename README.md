# Proyecto Final - API REST TechLab

## 📌 Descripción General
Este proyecto implementa una **API REST** en Node.js con Express y Firebase Firestore como base de datos.  
La aplicación está pensada para simular un sistema de tienda online con:

- **Autenticación de usuarios** mediante JWT.
- **Roles** diferenciados (admin y cliente).
- **Gestión de productos** (CRUD).
- **Carrito de compras** persistente por usuario.
- **Órdenes de compra** generadas a partir del carrito.

---

## 🔧 Arquitectura del Código

### 1. `index.js`
- Punto de entrada de la aplicación.
- Configura Express, CORS y carga las rutas.
- Maneja errores globales (`404`, `401`, `403`, `500`).
- Llama a `dotenv.config()` para cargar variables de entorno.

### 2. `routes/`
- Define las rutas de la API:
  - `auth.routes.js`: login y autenticación.
  - `products.routes.js`: CRUD de productos.
  - `cart.routes.js`: operaciones sobre el carrito.
  - `admin.routes.js`: acceso a carritos y órdenes (solo admin).

### 3. `controllers/`
- Contienen la lógica de cada endpoint.
- Ejemplo: `auth.controller.js` valida credenciales y genera el JWT.

### 4. `services/`
- Encapsulan la interacción con Firestore.
- Ejemplo: `product.service.js` maneja consultas a la colección `products`.

### 5. `config/firebase.js`
- Inicializa Firebase Admin SDK.
- **Modo híbrido**:
  - Si existe `serviceAccountKey.json`, lo usa (local/profesor).
  - Si no existe, usa variables de entorno (producción/Vercel).

```js
import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;

try {
  serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
} catch (err) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export default db;




Autenticación
Se usa JWT (JSON Web Token).

Flujo:

El usuario hace POST /auth/login con credenciales.

El backend valida y genera un token firmado con JWT_SECRET.

El token se envía al cliente y se usa en cada request protegido.

Middleware verifica el token en cada ruta privada.



👥 Roles
Admin:

Crear, editar y eliminar productos.

Ver todos los carritos y órdenes.

Cliente:

Ver productos.

Manejar su propio carrito.

Confirmar órdenes de compra.

👉 El rol vendedor está contemplado en la arquitectura, pero no es requerido en las consignas principales.



🛒 Carrito
Cada usuario logueado tiene un carrito único en Firestore.

Operaciones:

Agregar productos.

Actualizar cantidades.

Eliminar productos.

Confirmar → se genera una orden en la colección orders.



📦 Endpoints Principales
Productos
GET /api/products → lista todos los productos.

GET /api/products/:id → producto por ID.

POST /api/products/create → crear producto (admin).

PUT /api/products/:id → actualiza un producto (admin).

DELETE /api/products/:id → eliminar producto (admin).



Autenticación
POST /auth/login → login y generación de JWT



Carrito
GET /api/cart → carrito del usuario.

POST /api/cart/add → agregar producto.

PUT /api/cart/update/:id → actualizar cantidad.

DELETE /api/cart/remove/:id → eliminar producto.

POST /api/cart/checkout → confirmar carrito y generar orden.



Ordenes
GET /api/orders → devuelve las órdenes del usuario logueado (historial de compras).  
GET /api/admin/orders → devuelve todas las órdenes del sistema (**solo admin**).  




⚙️ Manejo de Errores
404 Not Found → ruta inexistente.

401 Unauthorized → token faltante o inválido.

403 Forbidden → permisos insuficientes.

400 Bad Request → error en la petición.

500 Internal Server Error → fallo interno.



🔧 Firebase y Claves
Local / Profesor: usar serviceAccountKey.json en la raíz del proyecto.

Producción / Vercel: copiar los valores del JSON a variables de entorno (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).

.gitignore debe incluir .env y serviceAccountKey.json para no exponer credenciales en GitHub.



🚀 Deploy en Vercel
Subir repo a GitHub.

Conectar a Vercel.

Configurar variables de entorno en Settings → Environment Variables.

Deploy automático con cada push.



✅ Conclusión
Este proyecto demuestra:

Arquitectura modular (rutas, controladores, servicios, config).

Autenticación robusta con JWT.

Roles diferenciados (admin y cliente).

Carrito persistente y generación de órdenes.

Configuración segura de Firebase tanto en local como en producción.
