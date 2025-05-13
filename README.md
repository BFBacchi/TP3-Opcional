# 🛒 Mini Ecommerce con React + Vite + Bulma + Firebase Firestore

Este es un pequeño proyecto de ecommerce construido con React y Vite, utilizando Bulma como framework CSS y React Router para la navegación.  
**Ahora los productos se almacenan y consultan desde Firebase Firestore.**

## 🚀 Características

- Maquetado de páginas de Registro y Login.
- Página principal con listado de productos desde una API externa (FakeStore API) y guardado automático en Firestore.
- Persistencia de productos en Firestore: la app solo consulta la API externa la primera vez, luego usa Firestore.
- Detalle individual del producto consultando Firestore.
- Paginación configurable por el usuario.
- Navegación SPA con React Router.
- Estilos limpios y responsivos con Bulma.

## 🔥 Nueva funcionalidad: Integración con Firestore

- **Carga inicial:**  
  Si la colección `products` en Firestore está vacía, la app trae los productos desde la API externa y los guarda en Firestore usando el `id` original como identificador del documento.
- **Lectura de productos:**  
  Una vez cargados, todos los listados y detalles de productos se leen directamente desde Firestore.
- **Detalle de producto:**  
  Al hacer clic en "Ver más", la app busca el producto en Firestore usando el `id` de la URL.
- **Recarga de datos:**  
  Si necesitas reiniciar los datos, borra los documentos de la colección `products` desde la consola de Firebase y recarga la app.

## 📸 Vistas

- **Home**: listado de productos con paginación.
- **Detalle de producto**: nombre, descripción, precio, imagen y botón "Comprar".
- **Login** y **Registro**: solo maquetado, sin lógica de autenticación.

## 🧑‍💻 Tecnologías usadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Bulma](https://bulma.io/)
- [React Router DOM](https://reactrouter.com/)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [FakeStore API](https://fakestoreapi.com/)

## 📦 Instalación

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/mini-ecommerce-react.git
cd mini-ecommerce-react
```

2. Instalá las dependencias:

```bash
npm install
```

3. Configurá Firebase:

- Crea un proyecto en [Firebase](https://console.firebase.google.com/).
- Habilita Firestore en modo de prueba.
- Crea un archivo `src/config/firebase.js` con tu configuración de Firebase:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

- Las reglas recomendadas para desarrollo son:

```plaintext
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Iniciá la app:

```bash
npm run dev
```

## ⚠️ Notas

- Para producción, ajustá las reglas de seguridad de Firestore.
- Si el detalle de producto no funciona, asegurate de que los documentos en Firestore tengan como `id` el mismo `id` que el producto original de la API.
- Si necesitas reiniciar los datos, borra todos los documentos de la colección `products` desde la consola de Firestore y recarga la app.

---