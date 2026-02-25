# API Películas

API REST en Node.js con JavaScript para la gestión de películas y series (modo administrador). Desarrollada para la Institución Universitaria Digital de Antioquia. Arquitectura monolítica con backend separado; base de datos SQLite.

## Información del proyecto

- **Stack:** Node.js, Express, SQLite3, CORS
- **Base de datos:** SQLite (`database.sqlite`)
- **Estructura:** Rutas → Controladores (thin) → Servicios → DB
- **Módulos:** Género, Director, Productora, Tipo, Media (películas/series)
- Sin autenticación ni registro (por ahora). Uso recomendado con Postman o similar.

### Estructura de carpetas

```
api-peliculas/
├── package.json
├── index.js
├── database.sqlite
├── db/           (conexión e inicialización)
├── routes/       (endpoints por recurso)
├── controllers/   (orquestación HTTP)
└── services/     (lógica de negocio y acceso a datos)
```

## Cómo ejecutar

```bash
# Instalar dependencias (si no está hecho)
npm install

# Inicializar base de datos (crea tablas y datos iniciales de géneros y tipos)
npm run init-db

# Iniciar la API (puerto 3000 por defecto)
npm start
```

La API queda disponible en `http://localhost:3000`. Las respuestas son JSON.

---

## Endpoints y requests

Base URL: `http://localhost:3000/api`

Todas las peticiones con cuerpo deben usar `Content-Type: application/json`.

---

### Géneros — `/api/generos`

| Método | Ruta | Request | Descripción |
|--------|------|---------|-------------|
| GET | `/api/generos` | — | Lista todos los géneros. Sin body ni params. |
| GET | `/api/generos/:id` | **Params:** `id` (número) | Devuelve un género por ID. |
| POST | `/api/generos` | **Body (JSON):** `nombre` (string, requerido), `estado` (string: `"Activo"` \| `"Inactivo"`, opcional, default `"Activo"`), `descripcion` (string, opcional) | Crea un género. |
| PUT | `/api/generos/:id` | **Params:** `id` (número). **Body (JSON):** `nombre`, `estado`, `descripcion` (todos opcionales; solo se actualizan los enviados) | Actualiza un género. |
| DELETE | `/api/generos/:id` | **Params:** `id` (número) | Elimina un género. |

**Ejemplo POST:** `{ "nombre": "comedia", "estado": "Activo", "descripcion": "Género comedia" }`

---

### Directores — `/api/directores`

| Método | Ruta | Request | Descripción |
|--------|------|---------|-------------|
| GET | `/api/directores` | — | Lista todos los directores. |
| GET | `/api/directores/:id` | **Params:** `id` (número) | Devuelve un director por ID. |
| POST | `/api/directores` | **Body (JSON):** `nombres` (string, requerido), `estado` (string: `"Activo"` \| `"Inactivo"`, opcional, default `"Activo"`) | Crea un director. |
| PUT | `/api/directores/:id` | **Params:** `id`. **Body (JSON):** `nombres`, `estado` (opcionales) | Actualiza un director. |
| DELETE | `/api/directores/:id` | **Params:** `id` | Elimina un director. |

**Ejemplo POST:** `{ "nombres": "Christopher Nolan", "estado": "Activo" }`

---

### Productoras — `/api/productoras`

| Método | Ruta | Request | Descripción |
|--------|------|---------|-------------|
| GET | `/api/productoras` | — | Lista todas las productoras. |
| GET | `/api/productoras/:id` | **Params:** `id` (número) | Devuelve una productora por ID. |
| POST | `/api/productoras` | **Body (JSON):** `nombre` (string, requerido), `estado` (string: `"Activo"` \| `"Inactivo"`, opcional, default `"Activo"`), `slogan` (string, opcional), `descripcion` (string, opcional) | Crea una productora. |
| PUT | `/api/productoras/:id` | **Params:** `id`. **Body (JSON):** `nombre`, `estado`, `slogan`, `descripcion` (opcionales) | Actualiza una productora. |
| DELETE | `/api/productoras/:id` | **Params:** `id` | Elimina una productora. |

**Ejemplo POST:** `{ "nombre": "Warner Bros", "estado": "Activo", "slogan": "...", "descripcion": "..." }`

---

### Tipos — `/api/tipos`

| Método | Ruta | Request | Descripción |
|--------|------|---------|-------------|
| GET | `/api/tipos` | — | Lista todos los tipos (ej. película, serie). |
| GET | `/api/tipos/:id` | **Params:** `id` (número) | Devuelve un tipo por ID. |
| POST | `/api/tipos` | **Body (JSON):** `nombre` (string, requerido), `descripcion` (string, opcional) | Crea un tipo. |
| PUT | `/api/tipos/:id` | **Params:** `id`. **Body (JSON):** `nombre`, `descripcion` (opcionales) | Actualiza un tipo. |
| DELETE | `/api/tipos/:id` | **Params:** `id` | Elimina un tipo. |

**Ejemplo POST:** `{ "nombre": "documental", "descripcion": "Contenido documental" }`

---

### Media (películas y series) — `/api/media`

| Método | Ruta | Request | Descripción |
|--------|------|---------|-------------|
| GET | `/api/media` | — | Lista todos los registros de media. |
| GET | `/api/media/:id` | **Params:** `id` (número) | Devuelve un media por ID. |
| POST | `/api/media` | **Body (JSON):** ver abajo | Crea una película/serie. |
| PUT | `/api/media/:id` | **Params:** `id`. **Body (JSON):** mismos campos que POST (todos opcionales) | Actualiza un media. |
| DELETE | `/api/media/:id` | **Params:** `id` | Elimina un media. |

**Body para POST/PUT (Media):**

- `serial` (string, requerido en POST) — único.
- `titulo` (string, requerido en POST).
- `url` (string, requerido en POST) — único.
- `sinopsis` (string, opcional).
- `imagen_portada` (string, opcional).
- `anio_estreno` (número, opcional).
- `genero_id` (número, requerido) — debe existir y estar **Activo**.
- `director_id` (número, requerido) — debe existir y estar **Activo**.
- `productora_id` (número, requerido) — debe existir y estar **Activa**.
- `tipo_id` (número, requerido) — debe existir.

**Ejemplo POST:**  
`{ "serial": "MOV-001", "titulo": "Inception", "url": "https://ejemplo.com/inception", "sinopsis": "...", "anio_estreno": 2010, "genero_id": 1, "director_id": 1, "productora_id": 1, "tipo_id": 1 }`

---

## Códigos de respuesta

- **200** — OK (GET, PUT, DELETE correctos).
- **201** — Created (POST correcto, se devuelve el recurso creado).
- **400** — Bad Request (validación: campos requeridos, estado no permitido, serial/url duplicados, referencias inválidas o inactivas en Media).
- **404** — Not Found (recurso o ID no existe).
- **500** — Error interno del servidor.

Errores de validación se devuelven en JSON, por ejemplo: `{ "error": "mensaje descriptivo" }`.
