# API Contract – Cine 2026

Contrato de los endpoints implementados hasta ahora. Pensado para que el frontend sepa qué enviar y qué esperar.

- **Base URL (local):** `https://localhost:7131`
- **Formato:** JSON (`Content-Type: application/json`)
- **Autenticación:** JWT en el header `Authorization: Bearer <token>`
- **Roles:** `Admin` y usuario autenticado. Los endpoints marcados como *Público* no requieren token.

## Convenciones

### Códigos de estado

| Código | Significado |
|---|---|
| `200` | OK, con cuerpo |
| `201` | Recurso creado |
| `204` | OK, sin cuerpo |
| `400` | Request inválido (ver formato de errores) |
| `401` | Sin token, token inválido o vencido |
| `403` | Token válido pero sin rol `Admin` |
| `404` | Recurso o referencia inexistente |
| `409` | Conflicto con el estado actual (ya está en ese estado, sala ocupada, película inactiva) |

### Formato de errores

Hay dos formatos según el origen del error:

1. **Errores de negocio** (`404`, `409` y algunos `400`): cuerpo en **texto plano** con el mensaje.
   Ejemplo: `No existe el director con id: 99`
2. **Errores de validación del body** (campo faltante, valor fuera de rango): `400` en JSON estándar de ASP.NET (`ProblemDetails`), con el detalle por campo en `errors`.

### Formatos de datos

- **Fechas:** `"2026-11-20"` o ISO completo `"2026-11-20T00:00:00Z"`. En las funciones solo se usa la parte de fecha.
- **Booleanos:** `true` / `false` sin comillas.
- **Horas de función:** `1` = 15:00, `2` = 18:00, `3` = 22:00.

---

# Películas

## GET `/api/peliculas`

- **Acceso:** Público
- **Uso:** listar todas las películas, con sus géneros y actores.
- **Respuesta `200`:** lista de películas.

```json
[
  {
    "idPelicula": 12,
    "titulo": "Los autos locos",
    "duracion": 100,
    "idClasificacion": 2,
    "idDirector": 3,
    "fechaEstreno": "2026-11-15",
    "poster": "https://...",
    "sinopsis": "...",
    "activa": true,
    "peliculasGeneros": [],
    "actoresPeliculas": []
  }
]
```

> La respuesta devuelve la entidad completa, incluidas las listas de relaciones (`peliculasGeneros`, `actoresPeliculas`). La forma exacta de los objetos anidados puede variar; conviene verificarla en Swagger.

- **Incluye películas inactivas.** El front debe filtrar por `activa` si quiere mostrar solo la cartelera vigente.

## GET `/api/peliculas/{id}`

- **Acceso:** usuario autenticado (cualquier rol)
- **Respuesta `200`:** una película (mismo formato que arriba).
- **Errores:** `404` `No existe pélicula con id: {id}` · `401` sin token.

## POST `/api/peliculas`

- **Acceso:** solo `Admin`
- **Uso:** crear una película con sus géneros y actores. Se guarda todo junto: o se crea todo o nada.

**Body:**

```json
{
  "titulo": "Título de ejemplo",
  "duracion": 125,
  "idClasificacion": 2,
  "idDirector": 8,
  "fechaEstreno": "2026-10-01",
  "poster": "/ruta/poster.jpg",
  "sinopsis": "...",
  "idsGeneros": [1, 3],
  "idsActores": [4, 9, 15]
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `titulo` | string | Obligatorio, máx. 200 caracteres |
| `duracion` | int | Entre 1 y 600 (minutos) |
| `idClasificacion` | int | ≥ 1, debe existir |
| `idDirector` | int | ≥ 1, debe existir |
| `fechaEstreno` | fecha | Obligatoria |
| `poster` | string | Opcional. Debe entrar en la columna de la base |
| `sinopsis` | string | Opcional |
| `idsGeneros` | int[] | Cada id debe existir. Los repetidos se ignoran |
| `idsActores` | int[] | Cada id debe existir. Los repetidos se ignoran |

La película se crea siempre con `activa = true`. No se puede enviar `activa` en el body.

**Respuestas:**

| Código | Cuándo |
|---|---|
| `201` | Creada. Cuerpo: `{ "idPelicula": 94 }` |
| `400` | Body inválido |
| `404` | `No existe la clasificación con id: 99`, `No existe el director con id: 99`, `No existen los géneros con id: 50, 60`, `No existen los actores con id: 77` |
| `401` / `403` | Sin token / sin rol Admin |

## PUT `/api/peliculas/{id}/estado`

- **Acceso:** solo `Admin`
- **Uso:** activar o desactivar una película sin eliminarla. El historial de funciones se conserva.

**Body:**

```json
{ "activa": false }
```

`activa` es obligatorio. Si falta, responde `400`.

**Respuestas:**

| Código | Cuándo |
|---|---|
| `204` | Estado cambiado (sin cuerpo) |
| `400` | Falta `activa` |
| `404` | `No existe película con id: {id}` |
| `409` | `La película ya se encuentra activa` / `inactiva` |
| `401` / `403` | Sin token / sin rol Admin |

---

# Funciones

## POST `/api/funciones`

- **Acceso:** solo `Admin`
- **Uso:** programar una función.

**Body:**

```json
{
  "fecha": "2026-11-20",
  "idHoraFuncion": 2,
  "subtitulada": false,
  "idPelicula": 12,
  "idSala": 2,
  "idIdioma": 1
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `fecha` | fecha | Obligatoria |
| `idHoraFuncion` | int | Debe existir (1, 2 o 3) |
| `subtitulada` | bool | Obligatorio |
| `idPelicula` | int | Debe existir y estar **activa** |
| `idSala` | int | Debe existir |
| `idIdioma` | int | Debe existir |

**Regla de solapamiento:** la sala no puede tener otra función cuyo intervalo se superponga. Se compara `inicio = fecha + hora` y `fin = inicio + duración de la película + 15 min de margen`, usando `Inicio1 < Fin2 AND Inicio2 < Fin1`. Se consideran también las funciones del día anterior y del siguiente, porque una función nocturna puede terminar pasada la medianoche.

**Respuestas:**

| Código | Cuándo |
|---|---|
| `201` | Creada. Cuerpo: `{ "idFuncion": 250 }` |
| `400` | Body inválido |
| `404` | `No existe la película / sala / idioma / hora de función con id: X` |
| `409` | Película inactiva, o `La sala 2 se superpone con la función 17 (20/11 18:00 a 20/11 20:00)` |
| `401` / `403` | Sin token / sin rol Admin |

## GET `/api/funciones`

- **Acceso:** Público
- **Uso:** consultar funciones con filtros opcionales.

**Query params (ambos opcionales):**

| Param | Tipo | Ejemplo |
|---|---|---|
| `fecha` | fecha | `2026-11-20` |
| `idPelicula` | int | `12` |

Ejemplo: `GET /api/funciones?fecha=2026-11-20&idPelicula=12`

**Respuesta `200`** (ordenada por fecha y hora; `[]` si no hay resultados):

```json
[
  {
    "idFuncion": 250,
    "fecha": "2026-11-20T00:00:00",
    "hora": "18:00:00",
    "subtitulada": false,
    "idPelicula": 12,
    "tituloPelicula": "Los autos locos",
    "idSala": 2,
    "idIdioma": 1
  }
]
```

- Devuelve funciones pasadas y futuras, y también las de películas inactivas.
- `400` si `fecha` o `idPelicula` tienen un formato inválido.

## GET `/api/funciones/{id}/butacas`

- **Acceso:** Público
- **Uso:** plano de butacas de una función con su disponibilidad actual.

La disponibilidad se calcula por la combinación **función + butaca** (tabla `OcupacionesButacas`). Una misma butaca puede estar ocupada en una función y libre en otra. No se usa `Butacas.reservada`.

**Respuesta `200`** (ordenada por fila y número):

```json
[
  { "idButaca": 31, "fila": "A", "numero": 1, "ocupada": false },
  { "idButaca": 32, "fila": "A", "numero": 2, "ocupada": true }
]
```

**Errores:** `404` `No existe la función con id: {id}`.

---

# Estadísticas (panel de administrador)

Todos son `GET`, **solo `Admin`**, y devuelven una lista con el mismo formato, pensada para alimentar gráficos:

```json
[ { "etiqueta": "texto del eje", "valor": 123.4 } ]
```

Si no hay datos, responden `200` con `[]` (la ocupación siempre devuelve los tres horarios). Una "venta" es cada fila de `DetallesFacturas`.

## GET `/api/estadisticas/ingresos-por-mes`

Ingresos (suma de `precioUnitario`) agrupados por mes de emisión de la factura.

| Param | Tipo | Opcional |
|---|---|---|
| `desde` | fecha | Sí |
| `hasta` | fecha | Sí |

```json
[ { "etiqueta": "2026-03", "valor": 1520000.00 } ]
```

`400` si `desde` es posterior a `hasta`.

## GET `/api/estadisticas/top-peliculas`

Películas con más entradas vendidas, de mayor a menor.

| Param | Tipo | Default | Regla |
|---|---|---|---|
| `top` | int | `10` | Entre 1 y 50, si no `400` |

```json
[ { "etiqueta": "Los autos locos", "valor": 124 } ]
```

## GET `/api/estadisticas/ocupacion-por-horario`

Porcentaje de ocupación (0 a 100) por franja horaria: butacas ocupadas ÷ (cantidad de funciones × butacas de su sala).

| Param | Tipo | Opcional |
|---|---|---|
| `desde` | fecha | Sí |
| `hasta` | fecha | Sí |

Sin parámetros calcula sobre **todas** las funciones de la base, no solo las de hoy. Para ver un período concreto hay que enviar `desde` y `hasta`.

```json
[
  { "etiqueta": "15:00", "valor": 42.5 },
  { "etiqueta": "18:00", "valor": 71.0 },
  { "etiqueta": "22:00", "valor": 55.3 }
]
```

## GET `/api/estadisticas/uso-promociones`

Cantidad de entradas vendidas con cada promoción, de mayor a menor. Sin parámetros. Solo aparecen promociones con al menos un uso.

```json
[
  { "etiqueta": "Miércoles 10% de descuento", "valor": 480 },
  { "etiqueta": "Función Noche 10% de descuento", "valor": 310 }
]
```

---

# Pendiente de documentar

- **Login (`JwtController`):** formato del request/response de `UserLoginDto` y `LoginResponseDto`.
- **Reservas:** `PostReservaDto` (`idFuncion`, `idButaca`, `idTipoEntrada`) y su endpoint.
- Endpoints de clientes, facturación y los que se sumen.

# Notas para el frontend

- El token debe enviarse en **cada** request a un endpoint con acceso restringido.
- Los mensajes de error `404` y `409` son texto plano y se pueden mostrar directamente al usuario.
- Para mostrar la cartelera, combinar `GET /api/peliculas` (filtrando `activa`) con `GET /api/funciones?fecha=...`.
