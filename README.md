# 🛒 Mini Ecommerce con React + Vite + Bulma + Firebase Firestore

Este es un pequeño proyecto de ecommerce construido con React y Vite, utilizando Bulma como framework CSS y React Router para la navegación.  
**Ahora los productos se almacenan y consultan desde Firebase Firestore.**

## 🚀 Características

- Maquetado de páginas de Registro y Login con autenticación usando Firebase Authentication (email y contraseña).
- Página principal con listado de productos desde una API externa (FakeStore API) y guardado automático en Firestore.
- Persistencia de productos en Firestore: la app solo consulta la API externa la primera vez, luego usa Firestore.
- Detalle individual del producto consultando Firestore.
- Paginación configurable por el usuario.
- Navegación SPA con React Router.
- Estilos limpios y responsivos con Bulma.
- **Backoffice**: Panel de administración para usuarios autenticados, donde se pueden crear, editar y eliminar productos (CRUD completo) mediante un formulario en modal.

## 🔥 Nuevas funcionalidades

- **Autenticación de usuarios:**  
  Registro, login y logout usando Firebase Authentication. Los botones de login y registro desaparecen al estar autenticado y aparece el botón de logout.
- **Backoffice (CRUD de productos):**  
  Los usuarios autenticados pueden acceder a `/backoffice` para gestionar productos. El formulario de creación/edición aparece en un modal y permite modificar o eliminar productos fácilmente.
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
- **Login** y **Registro**: autenticación real con Firebase.
- **Backoffice**: tabla de productos con botones para crear, modificar (con datos precargados) y eliminar productos, todo en modal.

## 🧑‍💻 Tecnologías usadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Bulma](https://bulma.io/)
- [React Router DOM](https://reactrouter.com/)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [Firebase Authentication](https://firebase.google.com/products/auth)
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
- Habilita el método de autenticación Email/Password en la sección Authentication.
- Crea un archivo `src/config/firebase.js` con tu configuración de Firebase:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
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
- El acceso al Backoffice solo está disponible para usuarios autenticados.

---