# FORJA — Registro de entrenamiento

App web (React + Vite) para registrar tus sesiones de gimnasio: ejercicios, series, repeticiones, peso y RIR. Funciona desde el navegador, sin instalar nada, y sincroniza tus datos entre celular y computador (Firebase).

## Estructura del proyecto

```
gym-tracker/
├── src/
│   ├── components/    # Navbar, bloque de ejercicio
│   ├── context/        # AuthContext (sesión de usuario)
│   ├── hooks/           # useWorkouts (lectura/escritura en Firestore)
│   ├── pages/           # Login, Dashboard, History, Progress, Profile
│   ├── firebase.js      # Configuración de Firebase
│   ├── App.jsx          # Rutas
│   └── main.jsx         # Punto de entrada
├── firestore.rules     # Reglas de seguridad (cada usuario ve solo sus datos)
├── .env.example         # Plantilla de variables de entorno
└── package.json
```

---

## Paso 1: Crear tu proyecto de Firebase (gratis, ~5 min)

1. Ve a https://console.firebase.google.com y crea un proyecto nuevo (nombre libre, ej. "forja-gym").
2. En el menú lateral, entra a **Authentication** → pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
3. Entra a **Firestore Database** → **Crear base de datos** → elige modo **producción** → cualquier región.
4. Dentro de Firestore, ve a la pestaña **Reglas** y pega el contenido del archivo `firestore.rules` de este proyecto. Publica los cambios. Esto asegura que **solo tú** puedas leer/escribir tus propios entrenamientos.
5. Ve a **Configuración del proyecto** (ícono de engranaje) → sección **Tus apps** → clic en el ícono `</>` (Web) → registra la app (no necesitas Firebase Hosting).
6. Copia el objeto `firebaseConfig` que te muestra: ahí están los 6 valores que necesitas.

## Paso 2: Configurar el proyecto localmente

```bash
cd gym-tracker
npm install
cp .env.example .env
```

Abre `.env` y pega los valores de tu `firebaseConfig`:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Para probar en tu computador:

```bash
npm run dev
```

Abre `http://localhost:5173`, crea tu cuenta (correo + contraseña) y prueba registrar un entrenamiento.

---

## Paso 3: Subir el código a GitHub

```bash
git init
git add .
git commit -m "Primera versión de FORJA"
```

Crea un repositorio nuevo (vacío) en https://github.com/new y luego:

```bash
git remote add origin https://github.com/TU_USUARIO/gym-tracker.git
git branch -M main
git push -u origin main
```

> El archivo `.gitignore` ya excluye `.env` y `node_modules`, así que tus claves no se suben a GitHub.

---

## Paso 4: Desplegar gratis en Vercel

1. Ve a https://vercel.com y crea una cuenta (puedes entrar con tu cuenta de GitHub).
2. Clic en **Add New → Project** → selecciona el repositorio `gym-tracker`.
3. Vercel detecta automáticamente que es un proyecto Vite. Antes de darle a "Deploy", abre la sección **Environment Variables** y añade las mismas 6 variables de tu archivo `.env` (una por una).
4. Clic en **Deploy**. En 1-2 minutos tendrás una URL pública como `https://gym-tracker-tuusuario.vercel.app`.

Esa URL:
- Funciona en cualquier navegador (celular, tablet, computador).
- Tiene HTTPS automático.
- Se actualiza sola cada vez que haces `git push` a `main`.

### Para tenerla como "app" en tu celular sin ocupar espacio de instalación
- **iPhone (Safari):** abre la URL → botón compartir → "Añadir a pantalla de inicio".
- **Android (Chrome):** abre la URL → menú (⋮) → "Añadir a pantalla de inicio".

Esto crea un ícono que abre la app en pantalla completa, como si fuera nativa, pero sigue siendo la web (cero instalación real, cero peso en tu almacenamiento).

---

## Modelo de datos (Firestore)

```
users/{tu_uid}/workouts/{workoutId}
  date: "2026-07-20"
  notes: "Buena sesión, subí peso en sentadilla"
  exercises: [
    { name: "Sentadilla", sets: [{ weight: 80, reps: 8, rir: 2 }, ...] }
  ]
  createdAt: <timestamp>
```

Cada usuario solo puede leer/escribir su propia subcolección (ver `firestore.rules`), así que puedes compartir el mismo proyecto de Firebase con otras personas en el futuro sin que vean tus datos.

## Funcionalidades incluidas

- **Hoy:** registra ejercicios, series (peso/reps/RIR), notas. Si ya registraste algo hoy, lo edita en vez de duplicar.
- **Historial:** todas tus sesiones pasadas, con volumen total y detección automática de récords personales (PR) por ejercicio.
- **Progreso:** gráfico de evolución de peso máximo por ejercicio + 1RM estimado (fórmula de Epley).
- **Perfil:** resumen de sesiones totales, últimos 30 días, y cierre de sesión.
- Diseño 100% responsive, pensado mobile-first, con navegación inferior tipo app nativa.

## Próximas mejoras posibles (no incluidas, para no sobrecargar la v1)
- Plantillas de rutina reutilizables (ej. "Día de pierna") para no escribir los ejercicios cada vez.
- Gráfico de volumen semanal total.
- Registro de peso corporal y fotos de progreso.

Si quieres que agregue alguna de estas, dímelo y las construimos en la siguiente iteración.
