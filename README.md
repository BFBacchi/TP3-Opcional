# 🛒 Mini Ecommerce con React + Vite + Bulma + Firebase Firestore

Este es un pequeño proyecto de ecommerce construido con React y Vite, utilizando Bulma como framework CSS y React Router para la navegación. Los productos se almacenan y consultan desde Firebase Firestore, y ahora cuenta con funcionalidades avanzadas de carrito y favoritos con persistencia diferenciada para usuarios y invitados.

## 🚀 Características Principales

- **Autenticación de Usuarios:** Registro, login y logout con Firebase Authentication (email y contraseña).
- **Gestión de Productos (Backoffice):** CRUD completo de productos para usuarios autenticados, con formulario en modal.
- **Catálogo de Productos:**
    - Carga inicial desde FakeStore API si Firestore está vacío.
    - Lectura posterior directa desde Firestore.
    - Paginación en la página principal.
    - Filtro por categoría y búsqueda por nombre de producto.
- **Detalle de Producto:** Vista individual de cada producto.
- **Lista de Favoritos:**
    - Marcar/desmarcar productos como favoritos con un botón de corazón.
    - Persistencia en Firestore (`userFavorites` colección) para usuarios autenticados.
    - Persistencia en `localStorage` para invitados.
- **Carrito de Compras:**
    - Añadir productos al carrito desde la lista o detalle.
    - Ver y gestionar artículos en la página del carrito (modificar cantidad, eliminar producto, vaciar carrito).
    - Persistencia en Firestore (`userCarts` colección) para usuarios autenticados.
    - Persistencia en `localStorage` para invitados.
    - Enlace en la barra de navegación con contador de artículos.
- **Gestión de Estado Global:**
    - `AuthContext` para gestionar el estado de autenticación del usuario.
    - `CartContext` para gestionar el estado del carrito de compras.
- **Navegación SPA:** Con React Router.
- **Estilos:** Con Bulma CSS, responsivos y limpios.

## 🔥 Flujo de Datos y Persistencia

- **Productos:** Se cargan de FakeStore API a la colección `products` de Firestore la primera vez. Luego, todas las lecturas son desde Firestore.
- **Favoritos y Carrito:**
    - **Usuarios Autenticados:** Sus listas de favoritos y los artículos del carrito se guardan en colecciones dedicadas en Firestore (`userFavorites/{userId}` y `userCarts/{userId}` respectivamente). Esto permite que sus selecciones persistan entre dispositivos y sesiones.
    - **Invitados (No Autenticados):** Sus favoritos y carrito se guardan en el `localStorage` del navegador. Estos datos se pierden si limpian el caché del navegador o cambian de dispositivo.
- Al iniciar sesión, la aplicación intenta cargar los favoritos y el carrito desde Firestore. Si el usuario cierra sesión, se vuelve a la persistencia en `localStorage`.

## 📸 Vistas Principales

- **Home (`/`)**: Listado de productos con filtros, paginación, botones de favoritos y añadir al carrito.
- **Detalle de producto (`/product/:id`)**: Información completa del producto.
- **Login (`/login`)** y **Registro (`/register`)**: Formularios para autenticación.
- **Carrito (`/cart`)**: Vista detallada del carrito de compras con opciones de gestión.
- **Backoffice (`/backoffice`)**: Panel de administración de productos (CRUD) para usuarios autenticados.

## 🧑‍💻 Tecnologías y Conceptos Clave

- **Framework/Librerías:**
    - [React](https://reactjs.org/) (con Hooks)
    - [Vite](https://vitejs.dev/)
    - [Bulma](https://bulma.io/)
    - [React Router DOM](https://reactrouter.com/)
- **Firebase:**
    - [Firebase Authentication](https://firebase.google.com/products/auth)
    - [Firebase Firestore](https://firebase.google.com/products/firestore) (Base de Datos NoSQL)
- **Gestión de Estado:**
    - React Context API (`AuthContext` para la autenticación, `CartContext` para el carrito).
- **APIs Externas:**
    - [FakeStore API](https://fakestoreapi.com/) (para carga inicial de productos).
- **Almacenamiento Local:**
    - `localStorage` (para persistencia de favoritos/carrito de invitados).

## 📦 Instalación

1.  Cloná el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/mini-ecommerce-react.git
    cd mini-ecommerce-react
    ```
2.  Instalá las dependencias:
    ```bash
    npm install
    ```
3.  Configurá Firebase:
    *   Crea un proyecto en [Firebase](https://console.firebase.google.com/).
    *   Habilita **Firestore** en modo de prueba (o con reglas adecuadas para producción).
    *   Habilita el método de autenticación **Email/Password** en la sección Authentication.
    *   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase (Vite las carga automáticamente):
        ```env
        VITE_FIREBASE_API_KEY=TU_API_KEY
        VITE_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
        VITE_FIREBASE_PROJECT_ID=TU_PROJECT_ID
        VITE_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
        VITE_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
        VITE_FIREBASE_APP_ID=TU_APP_ID
        VITE_FIREBASE_MEASUREMENT_ID=TU_MEASUREMENT_ID (opcional)
        ```
    *   Asegúrate que tu archivo `src/config/firebase.js` esté configurado para usar estas variables de entorno:
        ```javascript
        // src/config/firebase.js
        import { initializeApp } from "firebase/app";
        import { getFirestore } from "firebase/firestore";
        import { getAuth } from "firebase/auth";

        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
          measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
        };

        const app = initializeApp(firebaseConfig);
        export const db = getFirestore(app);
        export const auth = getAuth(app);
        ```
    *   Las reglas recomendadas para desarrollo en Firestore son (ajústalas para producción):
        ```plaintext
        service cloud.firestore {
          match /databases/{database}/documents {
            // Permite lectura y escritura global, solo para desarrollo
            match /{document=**} {
              allow read, write: if true;
            }

            // Reglas más específicas para producción (ejemplo):
            // match /products/{productId} {
            //   allow read: if true;
            //   allow write: if request.auth != null; // Solo usuarios autenticados pueden escribir
            // }
            // match /userFavorites/{userId} {
            //   allow read, write: if request.auth != null && request.auth.uid == userId;
            // }
            // match /userCarts/{userId} {
            //   allow read, write: if request.auth != null && request.auth.uid == userId;
            // }
          }
        }
        ```

4.  Iniciá la app:
    ```bash
    npm run dev
    ```

## ⚠️ Notas Importantes

-   **Seguridad en Producción:** Las reglas de Firestore mostradas para desarrollo son abiertas. **Debes** configurarlas de manera segura para un entorno de producción, permitiendo acceso solo a usuarios autenticados a sus propios datos (favoritos, carrito) y restringiendo la escritura en la colección de productos al backoffice.
-   **FontAwesome (Iconos):** El ícono del carrito en la barra de navegación usa FontAwesome (`<i class="fas fa-shopping-cart"></i>`). Si no se muestra, instala FontAwesome:
    ```bash
    npm install @fortawesome/fontawesome-free
    ```
    Y luego impórtalo en `src/main.jsx` (o tu archivo CSS global):
    ```javascript
    // src/main.jsx
    import '@fortawesome/fontawesome-free/css/all.min.css';
    ```
-   **Recarga de Datos de Productos:** Si necesitas reiniciar los datos de la colección `products`, puedes borrarla desde la consola de Firebase. La aplicación volverá a cargar los productos desde FakeStore API la próxima vez que se inicie si la colección está vacía.

---