# API Contract – Cine 2026

## 1. Información general

Contrato de comunicación entre el frontend y el backend del sistema Cine 2026.

- **Backend:** ASP.NET Core Web API
- **Base de datos:** Microsoft SQL Server (`cine_proyecto`)
- **Base URL local:** `https://localhost:7131`
- **Formato:** JSON
- **Content-Type:** `application/json`
- **Autenticación:** JWT Bearer
- **Roles definidos en el token:** `Admin` y `Client`

El backend utiliza Entity Framework Core para acceder a la base de datos.

**Importante:** este documento diferencia los endpoints que existen actualmente en el backend de las funcionalidades que todavía no tienen una implementación disponible. No se deben consumir rutas pendientes como si ya estuvieran funcionando.

---

## 2. Convenciones generales

### 2.1. Formato de las solicitudes

Las solicitudes que envían un body utilizan JSON.

Ejemplo:

```http
POST /api/peliculas
Content-Type: application/json
```

### 2.2. Fechas y horas

- Las fechas se envían en formato `YYYY-MM-DD` o en un formato ISO 8601 aceptado por ASP.NET.
- Los horarios de las funciones se representan mediante `idHoraFuncion`.
- En las respuestas de funciones, `hora` se devuelve como una cadena de hora (`TimeSpan`).

### 2.3. Códigos HTTP

| Código | Significado                                                                         |
| ------ | ----------------------------------------------------------------------------------- |
| 200    | Solicitud procesada correctamente. Devuelve contenido.                              |
| 201    | Recurso creado correctamente.                                                       |
| 204    | Operación procesada correctamente, sin contenido de respuesta.                      |
| 400    | Solicitud inválida o error de validación.                                           |
| 401    | No autenticado o credenciales inválidas.                                            |
| 403    | Usuario autenticado sin permisos suficientes, cuando la autorización está aplicada. |
| 404    | Recurso o referencia inexistente.                                                   |
| 409    | Conflicto con el estado actual del recurso.                                         |
| 500    | Error interno del servidor.                                                         |

### 2.4. Formato de errores

El backend puede devolver errores en distintos formatos según el origen.

**Errores de negocio**

Algunos errores devuelven texto plano.

Ejemplo:

```text
No existe el director con id: 99
```

**Errores de validación**

Los errores producidos por validaciones de ASP.NET pueden devolver un objeto `ProblemDetails`, con información en la propiedad `errors`.

**Errores de login**

El endpoint de login devuelve un objeto JSON con una propiedad `message`.

El frontend debe contemplar los distintos formatos y no asumir que todos los errores tienen la misma estructura.

---

## 3. Autenticación

### 3.1. Login

**POST `/api/login`**

- **Estado:** implementado.
- **Acceso previsto:** público.
- **Uso:** autenticar un cliente o administrador y obtener un JWT.

**Body:**

```json
{
  "userEmail": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

El DTO utilizado por el backend contiene:

| Campo     | Tipo   |
| --------- | ------ |
| userEmail | string |
| password  | string |

**Respuesta 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 15,
  "email": "usuario@ejemplo.com",
  "isAdmin": false
}
```

Campos de la respuesta:

| Campo   | Tipo   | Descripción                            |
| ------- | ------ | -------------------------------------- |
| token   | string | JWT generado por el backend.           |
| userId  | int    | Identificador del usuario autenticado. |
| email   | string | Correo electrónico del usuario.        |
| isAdmin | bool   | Indica si el usuario es administrador. |

**Errores:**

| Código | Situación                        | Respuesta orientativa                              |
| ------ | -------------------------------- | -------------------------------------------------- |
| 400    | Body inválido o ausente          | Objeto con `message`.                              |
| 401    | Usuario o contraseña incorrectos | `{ "message": "Usuario y/o Password incorrecto" }` |
| 500    | Error interno                    | Objeto con `message`.                              |

### 3.2. Claims del JWT

El token generado contiene los siguientes claims:

- `NameIdentifier`: identificador del usuario.
- `Name`: correo electrónico.
- `Role`: `Admin` o `Client`.

El token tiene una duración de 30 minutos.

### 3.3. Envío del token

Cuando un endpoint requiera autenticación, el frontend deberá enviar:

```http
Authorization: Bearer <token>
```

El token debe almacenarse y administrarse desde el contexto de autenticación del frontend, evitando duplicar la lógica en cada componente.

**Advertencia sobre la implementación actual:** aunque el backend configura autenticación JWT, varias restricciones `[Authorize]` y `[Authorize(Roles = "Admin")]` están comentadas en los controladores. Por lo tanto, no se debe asumir que todos los permisos descriptos en la planificación están aplicados actualmente.

---

# 4. Películas

## 4.1. Listar películas

**GET `/api/peliculas`**

- **Estado:** implementado.
- **Acceso:** público.
- **Uso:** obtener todas las películas.

**Respuesta 200:**

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

La respuesta devuelve la entidad de película, incluyendo sus relaciones de géneros y actores.

La estructura exacta de los objetos anidados debe verificarse en Swagger.

**Consideraciones:**

- El endpoint incluye películas activas e inactivas.
- Para mostrar la cartelera vigente, el frontend debe filtrar por `activa`.
- La respuesta no debe tratarse como un DTO reducido: devuelve la entidad y sus relaciones.

## 4.2. Obtener película por ID

**GET `/api/peliculas/{id}`**

- **Estado:** implementado.
- **Uso:** consultar una película por su identificador.

**Respuesta 200:**

Devuelve la entidad de película con el mismo formato general del listado.

**Errores:**

| Código | Situación                  |
| ------ | -------------------------- |
| 404    | La película no existe.     |
| 400    | Error durante la consulta. |

Ejemplo de mensaje:

```text
No existe pélicula con id: 12
```

**Nota:** el atributo `[Authorize]` de este endpoint está comentado en el controlador actual. No asumir que requiere autenticación hasta que se aplique esa restricción.

## 4.3. Crear película

**POST `/api/peliculas`**

- **Estado:** implementado.
- **Uso:** crear una película con sus géneros y actores.
- **Acceso previsto:** Admin.

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

| Campo           | Tipo   | Validación                              |
| --------------- | ------ | --------------------------------------- |
| titulo          | string | Obligatorio.                            |
| duracion        | int    | Entre 1 y 600 minutos.                  |
| idClasificacion | int    | Mayor o igual a 1 y debe existir.       |
| idDirector      | int    | Mayor o igual a 1 y debe existir.       |
| fechaEstreno    | date   | Obligatoria.                            |
| poster          | string | El DTO actual lo exige.                 |
| sinopsis        | string | Opcional.                               |
| idsGeneros      | int[]  | El DTO exige que se envíe la colección. |
| idsActores      | int[]  | El DTO exige que se envíe la colección. |

El backend valida las referencias y crea las relaciones correspondientes.

La película se crea con `activa = true`.

**Respuesta 201:**

```json
{
  "idPelicula": 94
}
```

**Errores:**

| Código | Situación                                                      |
| ------ | -------------------------------------------------------------- |
| 400    | Body inválido o validaciones fallidas.                         |
| 404    | No existe la clasificación, director, género o actor indicado. |

Ejemplos de errores de referencias:

```text
No existe la clasificación con id: 99
No existe el director con id: 99
No existen los géneros con id: 50, 60
No existen los actores con id: 77
```

**Importante:** el DTO actual exige `poster`, `idsGeneros` e `idsActores`. No asumir que `poster` es opcional, aunque la columna de la base de datos permita `NULL`.

La restricción de acceso de administrador está comentada en el controlador actual.

## 4.4. Cambiar estado de película

**PUT `/api/peliculas/{id}/estado`**

- **Estado:** implementado.
- **Uso:** activar o desactivar una película.
- **Acceso previsto:** Admin.

**Body:**

```json
{
  "activa": false
}
```

| Campo  | Tipo | Validación   |
| ------ | ---- | ------------ |
| activa | bool | Obligatorio. |

**Respuesta 204:**

Sin contenido.

**Errores:**

| Código | Situación                                            |
| ------ | ---------------------------------------------------- |
| 400    | Falta el campo `activa` o se produce otro error.     |
| 404    | No existe la película.                               |
| 409    | La película ya se encuentra en el estado solicitado. |

La operación modifica el estado de la película sin eliminarla físicamente.

La restricción de acceso de administrador está comentada en el controlador actual.

---

# 5. Funciones

## 5.1. Crear función

**POST `/api/funciones`**

- **Estado:** implementado.
- **Uso:** programar una nueva función.
- **Acceso previsto:** Admin.

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

| Campo         | Tipo | Validación                        |
| ------------- | ---- | --------------------------------- |
| fecha         | date | Obligatoria.                      |
| idHoraFuncion | int  | Mayor o igual a 1 y debe existir. |
| subtitulada   | bool | Obligatorio.                      |
| idPelicula    | int  | Mayor o igual a 1 y debe existir. |
| idSala        | int  | Mayor o igual a 1 y debe existir. |
| idIdioma      | int  | Mayor o igual a 1 y debe existir. |

El backend verifica las referencias y que la película esté activa.

También valida que no existan funciones superpuestas en la misma sala.

Para determinar el solapamiento se considera el intervalo de la función, teniendo en cuenta la duración de la película y el margen de preparación definido en el backend.

**Respuesta 201:**

```json
{
  "idFuncion": 250
}
```

**Errores:**

| Código | Situación                                                          |
| ------ | ------------------------------------------------------------------ |
| 400    | Body inválido o error de validación.                               |
| 404    | No existe la película, sala, idioma u horario indicado.            |
| 409    | La película está inactiva o la sala tiene una función superpuesta. |

La restricción de acceso de administrador está comentada en el controlador actual.

## 5.2. Consultar funciones

**GET `/api/funciones`**

- **Estado:** implementado.
- **Acceso:** público.
- **Uso:** consultar funciones programadas.

**Query params:**

| Parámetro  | Tipo | Obligatorio |
| ---------- | ---- | ----------- |
| fecha      | date | No          |
| idPelicula | int  | No          |

Ejemplo:

```http
GET /api/funciones?fecha=2026-11-20&idPelicula=12
```

Los filtros pueden utilizarse individualmente o en conjunto.

**Respuesta 200:**

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

La respuesta contiene:

| Campo          | Tipo          |
| -------------- | ------------- |
| idFuncion      | int           |
| fecha          | date/datetime |
| hora           | time          |
| subtitulada    | bool          |
| idPelicula     | int           |
| tituloPelicula | string        |
| idSala         | int           |
| idIdioma       | int           |

Las funciones se ordenan por fecha y horario.

Si no hay resultados, devuelve una lista vacía.

El endpoint devuelve funciones pasadas y futuras, incluyendo funciones de películas inactivas.

## 5.3. Eliminar función

**DELETE `/api/Funciones/{id}`**

- **Estado:** implementado en `FuncionesController.Delete`.
- **Uso:** eliminar físicamente una función.
- **Parámetros de ruta:** `id` (int), identificador de la función.
- **Autorización:** actualmente no requiere autenticación ni rol; `[Authorize(Roles = "Admin")]` está comentado en el controlador.

El servicio devuelve `404` si la función no existe y rechaza la operación con `409` si tiene reservas o facturas asociadas. En caso contrario, el repositorio elimina la función y el controlador responde `204 No Content`. No se eliminan manualmente reservas ni facturas.

**Errores:**

| Código | Situación |
| ------ | --------- |
| 404 | No existe la función indicada. |
| 409 | La función tiene reservas o facturas asociadas. |
| 400 | Error no contemplado por las validaciones anteriores. |

## 5.4. Consultar butacas de una función

**GET `/api/funciones/{id}/butacas`**

- **Estado:** implementado.
- **Acceso:** público.
- **Uso:** consultar las butacas y su disponibilidad para una función.

**Respuesta 200:**

```json
[
  {
    "idButaca": 31,
    "fila": "A",
    "numero": 1,
    "ocupada": false
  },
  {
    "idButaca": 32,
    "fila": "A",
    "numero": 2,
    "ocupada": true
  }
]
```

| Campo    | Tipo   |
| -------- | ------ |
| idButaca | int    |
| fila     | string |
| numero   | int    |
| ocupada  | bool   |

Las butacas se devuelven ordenadas por fila y número.

La disponibilidad se determina mediante la tabla `OcupacionesButacas`, para la combinación de función y butaca.

No se debe utilizar `Butacas.reservada` como indicador global de disponibilidad.

**Errores:**

| Código | Situación                      |
| ------ | ------------------------------ |
| 404    | No existe la función indicada. |
| 400    | Error durante la consulta.     |

---

# 6. Estadísticas

Los siguientes endpoints están implementados y están destinados al panel de administración.

La respuesta utiliza el DTO `EstadisticaItemDto`.

Formato general:

```json
[
  {
    "etiqueta": "Texto",
    "valor": 123.4
  }
]
```

## 6.1. Ingresos por mes

**GET `/api/estadisticas/ingresos-por-mes`**

Devuelve los ingresos agrupados por mes de emisión de las facturas.

**Query params:**

| Parámetro | Tipo | Obligatorio |
| --------- | ---- | ----------- |
| desde     | date | No          |
| hasta     | date | No          |

Ejemplo:

```http
GET /api/estadisticas/ingresos-por-mes?desde=2026-01-01&hasta=2026-11-30
```

**Respuesta 200:**

```json
[
  {
    "etiqueta": "2026-03",
    "valor": 1520000.0
  }
]
```

Si no hay datos, devuelve `[]`.

Si la fecha inicial es posterior a la fecha final, devuelve `400`.

## 6.2. Top de películas

**GET `/api/estadisticas/top-peliculas`**

Devuelve las películas con mayor cantidad de entradas vendidas.

**Query params:**

| Parámetro | Tipo | Valor predeterminado |
| --------- | ---- | -------------------- |
| top       | int  | 10                   |

El parámetro `top` debe estar entre 1 y 50.

Ejemplo:

```http
GET /api/estadisticas/top-peliculas?top=5
```

**Respuesta 200:**

```json
[
  {
    "etiqueta": "Los autos locos",
    "valor": 124
  }
]
```

Si no hay datos, devuelve `[]`.

## 6.3. Ocupación por horario

**GET `/api/estadisticas/ocupacion-por-horario`**

Devuelve el porcentaje de ocupación agrupado por horario.

**Query params:**

| Parámetro | Tipo | Obligatorio |
| --------- | ---- | ----------- |
| desde     | date | No          |
| hasta     | date | No          |

Ejemplo:

```http
GET /api/estadisticas/ocupacion-por-horario?desde=2026-01-01&hasta=2026-11-30
```

**Respuesta 200:**

```json
[
  {
    "etiqueta": "15:00",
    "valor": 42.5
  },
  {
    "etiqueta": "18:00",
    "valor": 71.0
  },
  {
    "etiqueta": "22:00",
    "valor": 55.3
  }
]
```

El valor representa un porcentaje de ocupación entre 0 y 100.

Sin parámetros, calcula sobre todas las funciones de la base de datos.

Si no hay datos, devuelve los horarios contemplados por el servicio.

## 6.4. Uso de promociones

**GET `/api/estadisticas/uso-promociones`**

Devuelve la cantidad de entradas vendidas asociadas a cada promoción.

No recibe parámetros.

**Respuesta 200:**

```json
[
  {
    "etiqueta": "Miércoles 10% de descuento",
    "valor": 480
  },
  {
    "etiqueta": "Función Noche 10% de descuento",
    "valor": 310
  }
]
```

Solo aparecen promociones que registran al menos un uso.

Si no hay datos, devuelve `[]`.

---

# 7. Reservas y facturación

Los siguientes endpoints cuentan con un contrato definido para la integración entre el frontend y el backend.

**Importante:** que un endpoint esté documentado en este contrato no significa necesariamente que ya esté disponible en el entorno desplegado. La implementación y las pruebas de integración deben verificarse contra el backend y Swagger.

## 7.1. Reservas

### 7.1.1. Crear reserva

**POST `/api/reservas`**

- **Acceso:** Client.
- **Uso:** crear una reserva para una función y las butacas seleccionadas.

**Body:**

```json
{
  "idFuncion": 250,
  "detalles": [
    {
      "idButaca": 31,
      "idTipoEntrada": 1,
      "precio": 5000,
      "idPromocion": null
    },
    {
      "idButaca": 32,
      "idTipoEntrada": 2,
      "precio": 4000,
      "idPromocion": 3
    }
  ]
}
```

Cada detalle representa una butaca reservada para la función seleccionada.

| Campo                    | Tipo     | Descripción                         |
| ------------------------ | -------- | ----------------------------------- |
| idFuncion                | int      | Identificador de la función.        |
| detalles                 | array    | Entradas incluidas en la reserva.   |
| detalles[].idButaca      | int      | Identificador de la butaca.         |
| detalles[].idTipoEntrada | int      | Tipo de entrada seleccionado.       |
| detalles[].precio        | decimal  | Precio de la entrada.               |
| detalles[].idPromocion   | int/null | Promoción aplicada, si corresponde. |

**Consideraciones:**

- El cliente se identifica mediante el usuario autenticado.
- El backend valida que la función exista.
- El backend valida que las butacas correspondan a la sala de la función.
- El backend verifica que las butacas estén disponibles.
- No se permite crear una reserva sin detalles.
- `idPromocion` puede enviarse como `null`.
- El precio y la promoción se reciben desde el frontend según el alcance acordado para el proyecto.

**Respuesta 201:**

Devuelve la reserva creada y su identificador, según el DTO de respuesta del backend.

**Errores:**

| Código | Situación                                                  |
| ------ | ---------------------------------------------------------- |
| 400    | Body inválido o datos de entrada incorrectos.              |
| 401    | Usuario no autenticado.                                    |
| 403    | Usuario sin permisos.                                      |
| 404    | Función, butaca u otra referencia inexistente.             |
| 409    | Conflicto con la disponibilidad o el estado de una butaca. |
| 500    | Error interno del servidor.                                |

### 7.1.2. Listar reservas del usuario autenticado

**GET `/api/reservas/mis-reservas`**

- **Acceso:** Client.
- **Uso:** consultar las reservas pertenecientes al cliente autenticado.

El backend obtiene el identificador del cliente a partir del JWT. El frontend no debe enviar un `idCliente` para determinar qué reservas consultar.

**Respuesta 200:**

Devuelve la colección de reservas del cliente, con la información correspondiente a cada reserva y sus detalles.

Si no existen reservas, devuelve una lista vacía.

### 7.1.3. Listar reservas del sistema

**GET `/api/reservas`**

- **Acceso:** Admin.
- **Uso:** consultar las reservas registradas en el sistema.

**Respuesta 200:**

Devuelve la colección de reservas, incluyendo la información necesaria para su consulta y administración.

### 7.1.4. Obtener una reserva por ID

**GET `/api/reservas/{id}`**

- **Acceso:** Client y Admin.
- **Uso:** consultar el detalle de una reserva.

**Reglas de acceso:**

- Un Client solamente puede consultar sus propias reservas.
- Un Admin puede consultar cualquier reserva.

**Respuesta 200:**

Devuelve la reserva solicitada con sus datos y detalles.

**Errores:**

| Código | Situación                                       |
| ------ | ----------------------------------------------- |
| 401    | Usuario no autenticado.                         |
| 403    | El cliente intenta consultar una reserva ajena. |
| 404    | La reserva no existe.                           |

### 7.1.5. Cancelar reserva

**PATCH `/api/reservas/{id}/cancelar`**

- **Acceso:** Client y Admin.
- **Uso:** cancelar una reserva existente.

**Reglas de acceso:**

- Un Client solamente puede cancelar sus propias reservas.
- Un Admin puede cancelar cualquier reserva.

La cancelación modifica el estado de la reserva y libera las ocupaciones correspondientes. No elimina físicamente el registro ni su historial.

**Respuesta:**

Devuelve una respuesta satisfactoria cuando la cancelación se procesa correctamente.

**Errores:**

| Código | Situación                                            |
| ------ | ---------------------------------------------------- |
| 401    | Usuario no autenticado.                              |
| 403    | El cliente intenta cancelar una reserva ajena.       |
| 404    | La reserva no existe.                                |
| 409    | La reserva no puede cancelarse por su estado actual. |

### 7.1.6. Confirmar reserva

**POST `/api/reservas/{id}/confirmar`**

- **Acceso:** Client y Admin.
- **Uso:** confirmar una reserva y generar su factura.

**Body:**

```json
{
  "idFormaPago": 1,
  "idCanalVenta": 1
}
```

| Campo        | Tipo | Descripción                        |
| ------------ | ---- | ---------------------------------- |
| idFormaPago  | int  | Identificador de la forma de pago. |
| idCanalVenta | int  | Identificador del canal de venta.  |

**Reglas de acceso:**

- Un Client solamente puede confirmar sus propias reservas.
- Un Admin puede confirmar cualquier reserva.
- Cuando un Admin confirma una reserva, la factura se genera a nombre del cliente propietario de esa reserva, no del administrador que ejecutó la operación.

La confirmación genera la factura asociada a la reserva. No se integra una pasarela de pago: la operación registra la confirmación y genera la factura dentro del alcance del proyecto.

**Respuesta:**

Devuelve una respuesta satisfactoria cuando la reserva se confirma y se genera la factura.

**Errores:**

| Código | Situación                                             |
| ------ | ----------------------------------------------------- |
| 400    | Body inválido o referencias incorrectas.              |
| 401    | Usuario no autenticado.                               |
| 403    | El cliente intenta confirmar una reserva ajena.       |
| 404    | La reserva o alguna referencia no existe.             |
| 409    | La reserva no puede confirmarse por su estado actual. |
| 500    | Error interno del servidor.                           |

### 7.1.7. Estados de una reserva

La reserva conserva su registro durante todo su ciclo de vida.

- `estado = true`: reserva activa. Puede encontrarse pendiente o confirmada.
- `estado = false`: reserva cancelada.
- `fechaHoraConfirmacion = null`: reserva pendiente de confirmación.
- `fechaHoraConfirmacion` con valor: reserva confirmada.

No se contempla la expiración automática de reservas dentro del alcance actual del proyecto.

## 7.2. Facturación

### 7.2.1. Registrar factura directa

**POST `/api/facturas`**

- **Acceso:** Client y Admin.
- **Uso:** registrar una venta directa, sin una reserva previa.

**Body:**

```json
{
  "idCliente": 15,
  "idFormaPago": 1,
  "idCanalVenta": 1,
  "detalles": [
    {
      "idFuncion": 250,
      "idButaca": 31,
      "idTipoEntrada": 1,
      "precio": 5000,
      "idPromocion": null
    }
  ]
}
```

| Campo                    | Tipo     | Descripción                         |
| ------------------------ | -------- | ----------------------------------- |
| idCliente                | int      | Cliente al que se emite la factura. |
| idFormaPago              | int      | Forma de pago seleccionada.         |
| idCanalVenta             | int      | Canal de venta seleccionado.        |
| detalles                 | array    | Entradas incluidas en la factura.   |
| detalles[].idFuncion     | int      | Función de la entrada.              |
| detalles[].idButaca      | int      | Butaca correspondiente.             |
| detalles[].idTipoEntrada | int      | Tipo de entrada.                    |
| detalles[].precio        | decimal  | Precio de la entrada.               |
| detalles[].idPromocion   | int/null | Promoción aplicada, si corresponde. |

**Reglas según el rol:**

- Para un Client, el cliente se identifica a partir del usuario autenticado.
- Para un Admin, el cliente se indica mediante `idCliente` en el body.

**Consideraciones:**

- La operación registra una venta directa, sin asociarla a una reserva.
- Se deben enviar los detalles de las entradas.
- `idPromocion` puede ser `null`.
- El precio y la promoción se reciben desde el frontend según el alcance acordado para el proyecto.
- No se integra una pasarela de pago.

**Respuesta:**

Devuelve una respuesta satisfactoria cuando la factura se registra correctamente, incluyendo el identificador de la factura según el DTO de respuesta del backend.

**Errores:**

| Código | Situación                                                  |
| ------ | ---------------------------------------------------------- |
| 400    | Body inválido o datos incorrectos.                         |
| 401    | Usuario no autenticado.                                    |
| 403    | Usuario sin permisos.                                      |
| 404    | Cliente, función, butaca u otra referencia inexistente.    |
| 409    | Conflicto con la disponibilidad o el estado de una butaca. |
| 500    | Error interno del servidor.                                |

### 7.2.2. Listar facturas del sistema

**GET `/api/facturas`**

- **Acceso:** Admin.
- **Uso:** consultar todas las facturas registradas en el sistema.

**Respuesta 200:**

Devuelve la colección de facturas con sus datos y detalles correspondientes.

### 7.2.3. Listar facturas del usuario autenticado

**GET `/api/facturas/mis-facturas`**

- **Acceso:** Client.
- **Uso:** consultar las facturas pertenecientes al cliente autenticado.

El backend obtiene el identificador del cliente a partir del JWT.

**Respuesta 200:**

Devuelve la colección de facturas del cliente.

Si no existen facturas, devuelve una lista vacía.

### 7.2.4. Obtener factura por ID

**GET `/api/facturas/{id}`**

- **Acceso:** Client y Admin.
- **Uso:** consultar una factura específica.

**Reglas de acceso:**

- Un Client solamente puede consultar sus propias facturas.
- Un Admin puede consultar cualquier factura.

**Respuesta 200:**

Devuelve los datos de la factura y sus detalles.

**Errores:**

| Código | Situación                                       |
| ------ | ----------------------------------------------- |
| 401    | Usuario no autenticado.                         |
| 403    | El cliente intenta consultar una factura ajena. |
| 404    | La factura no existe.                           |

## 7.3. Catálogos utilizados en reservas y facturación

Actualmente no se cuenta con endpoints específicos para consultar los catálogos de:

- Tipos de entrada.
- Formas de pago.
- Canales de venta.
- Promociones.

Para el alcance actual del proyecto, las opciones pueden mantenerse definidas en el frontend.

**Importante:** los identificadores utilizados deben corresponder a registros existentes en la base de datos. No se deben inventar IDs suponiendo que coinciden con los valores de la base.

## 7.4. Consideraciones generales

- El cliente autenticado se determina mediante el JWT cuando corresponde.
- La disponibilidad de las butacas debe validarse en el backend al registrar una reserva o una venta directa.
- Las butacas deben pertenecer a la sala de la función seleccionada.
- Una operación que involucra varias entradas debe mantener la consistencia de los datos.
- Las reservas canceladas conservan su historial.
- La confirmación de una reserva genera una factura.
- Las ventas directas generan facturas sin reserva asociada.
- No se contempla la expiración automática de reservas.
- No se integra una pasarela de pago.
- Los códigos de error y formatos de respuesta deben manejarse según lo documentado para cada endpoint.

---

# 8. Resumen de endpoints

| Método | Ruta                                      | Estado contractual | Acceso              |
| ------ | ----------------------------------------- | ------------------ | ------------------- |
| POST   | `/api/login`                              | Implementado       | Público             |
| GET    | `/api/peliculas`                          | Implementado       | Público             |
| GET    | `/api/peliculas/{id}`                     | Implementado       | Público actualmente |
| POST   | `/api/peliculas`                          | Implementado       | Admin previsto      |
| PUT    | `/api/peliculas/{id}/estado`              | Implementado       | Admin previsto      |
| POST   | `/api/funciones`                          | Implementado       | Admin previsto      |
| GET    | `/api/funciones`                          | Implementado       | Público             |
| DELETE | `/api/Funciones/{id}`                     | Implementado       | Sin autorización actualmente |
| GET    | `/api/funciones/{id}/butacas`             | Implementado       | Público             |
| GET    | `/api/estadisticas/ingresos-por-mes`      | Implementado       | Admin previsto      |
| GET    | `/api/estadisticas/top-peliculas`         | Implementado       | Admin previsto      |
| GET    | `/api/estadisticas/ocupacion-por-horario` | Implementado       | Admin previsto      |
| GET    | `/api/estadisticas/uso-promociones`       | Implementado       | Admin previsto      |
| POST   | `/api/reservas`                           | Contrato definido  | Client              |
| GET    | `/api/reservas/mis-reservas`              | Contrato definido  | Client              |
| GET    | `/api/reservas`                           | Contrato definido  | Admin               |
| GET    | `/api/reservas/{id}`                      | Contrato definido  | Client / Admin      |
| PATCH  | `/api/reservas/{id}/cancelar`             | Contrato definido  | Client / Admin      |
| POST   | `/api/reservas/{id}/confirmar`            | Contrato definido  | Client / Admin      |
| POST   | `/api/facturas`                           | Contrato definido  | Client / Admin      |
| GET    | `/api/facturas`                           | Contrato definido  | Admin               |
| GET    | `/api/facturas/mis-facturas`              | Contrato definido  | Client              |
| GET    | `/api/facturas/{id}`                      | Contrato definido  | Client / Admin      |

**Aclaración:** "Contrato definido" indica que el request, el propósito y las reglas de acceso están documentados. No equivale por sí solo a confirmar que la implementación esté desplegada y operativa. Para comprobarlo, consultar el código del backend y Swagger.

---

# 9. Consideraciones de integración con el frontend

## 9.1. Organización de las llamadas HTTP

Las llamadas a la API deben mantenerse en una capa de servicios, separadas de los componentes visuales.

Se recomienda:

- Centralizar la configuración de Axios.
- Definir una instancia común con la URL base.
- Incorporar el token JWT mediante interceptores cuando corresponda.
- Mantener un servicio por dominio o funcionalidad.
- Evitar realizar llamadas HTTP directamente desde componentes de presentación.

## 9.2. Autenticación

El frontend debe:

1. Enviar las credenciales a `POST /api/login`.
2. Obtener el token y los datos del usuario.
3. Mantener el estado de autenticación en el contexto correspondiente.
4. Enviar el token en el header `Authorization` cuando el endpoint lo requiera.
5. Gestionar la expiración del token.
6. Diferenciar usuarios administradores de clientes utilizando los datos devueltos por el backend.

La interfaz puede controlar la navegación por roles, pero eso no reemplaza la autorización del servidor.

## 9.3. Manejo de errores

El frontend debe contemplar:

- `400`: mostrar errores de validación.
- `401`: gestionar la sesión o las credenciales.
- `403`: informar que el usuario no tiene permisos.
- `404`: informar que el recurso solicitado no existe.
- `409`: informar conflictos de disponibilidad o estado.
- `500`: mostrar un mensaje genérico de error del servidor.

No asumir que todos los errores devuelven JSON con una propiedad `message`.

## 9.4. Películas y funciones

Para construir la cartelera:

1. Consultar `GET /api/peliculas`.
2. Filtrar las películas según su propiedad `activa`.
3. Consultar `GET /api/funciones` con los filtros necesarios.
4. Relacionar las funciones con sus películas.
5. Mostrar horarios y datos de las funciones disponibles.

El detalle de película puede utilizar `GET /api/peliculas/{id}`.

## 9.5. Selección de butacas

Para mostrar el plano de butacas:

1. Obtener el identificador de la función seleccionada.
2. Consultar `GET /api/funciones/{id}/butacas`.
3. Renderizar las butacas según `fila`, `numero` y `ocupada`.
4. Impedir que el usuario seleccione butacas que ya estén ocupadas.
5. Volver a validar la disponibilidad al momento de crear una reserva, cuando ese endpoint esté implementado.

La disponibilidad mostrada en pantalla no garantiza que una butaca siga libre cuando se intente reservar.

## 9.6. Reservas

Para crear una reserva:

1. Obtener la función seleccionada.
2. Consultar sus butacas mediante `GET /api/funciones/{id}/butacas`.
3. Permitir seleccionar únicamente butacas que no estén ocupadas.
4. Enviar la función y los detalles seleccionados a `POST /api/reservas`.
5. Obtener del backend la reserva creada.
6. Mostrar el resultado de la operación sin asumir que fue exitosa antes de recibir una respuesta satisfactoria.

Para consultar las reservas del cliente:

- Utilizar `GET /api/reservas/mis-reservas`.
- No enviar un `idCliente` para filtrar las reservas propias.

Para consultar reservas desde administración:

- Utilizar `GET /api/reservas`.
- Para consultar una reserva específica, utilizar `GET /api/reservas/{id}`.

Para cancelar una reserva:

- Utilizar `PATCH /api/reservas/{id}/cancelar`.
- Actualizar la interfaz únicamente después de recibir una respuesta satisfactoria.

Para confirmar una reserva:

- Utilizar `POST /api/reservas/{id}/confirmar`.
- Enviar `idFormaPago` e `idCanalVenta`.
- La operación genera la factura asociada a la reserva.

## 9.7. Facturación

Para consultar las facturas:

- Los clientes deben utilizar `GET /api/facturas/mis-facturas`.
- Los administradores deben utilizar `GET /api/facturas`.
- Para consultar una factura individual, utilizar `GET /api/facturas/{id}`.

Para registrar una venta directa:

1. Obtener la función y las butacas seleccionadas.
2. Preparar los detalles de las entradas.
3. Enviar los datos a `POST /api/facturas`.
4. Si el usuario es Client, el backend identifica al cliente mediante el JWT.
5. Si el usuario es Admin, enviar el `idCliente` correspondiente.
6. Mostrar la factura o el resultado devuelto por el backend.

## 9.8. Catálogos de reservas y facturación

Como no existen endpoints específicos para los catálogos de tipos de entrada, formas de pago, canales de venta y promociones, las opciones se mantienen definidas en el frontend para el alcance actual del proyecto.

Los identificadores enviados deben coincidir con los registros existentes en la base de datos.

Los precios y promociones se envían desde el frontend de acuerdo con las decisiones de alcance del proyecto.

---

# 10. Consideraciones técnicas pendientes del backend

Antes de considerar completa la integración del frontend, deben revisarse los siguientes puntos:

1. **Autorización:** verificar que los atributos `[Authorize]` y `[Authorize(Roles = "Admin")]` estén habilitados en los controladores correspondientes. Actualmente existen restricciones comentadas en algunos controladores.
2. **CORS:** mantener una política que permita las solicitudes desde el origen utilizado por Vite durante el desarrollo.
3. **Login:** mantener la clave de firma JWT fuera del código fuente y utilizar configuración segura.
4. **Reservas y facturación:** verificar que los endpoints definidos en la sección 7 estén implementados y coincidan con los contratos documentados.
5. **Swagger:** mantener actualizada la documentación con los contratos reales de request y response.
6. **Errores:** procurar que los errores tengan formatos consistentes para facilitar su manejo desde React.

### Decisiones de alcance del proyecto

Para el desarrollo actual se aceptan las siguientes simplificaciones:

- Los precios y las promociones se reciben desde el frontend.
- Los catálogos de tipos de entrada, formas de pago, canales de venta y promociones pueden mantenerse definidos en el frontend.
- No se contempla la expiración automática de reservas.
- La confirmación de una reserva genera una factura, sin integración con una pasarela de pago.
- Se mantienen los códigos y formatos de error definidos por el backend, aunque algunos errores puedan terminar respondiendo con `500`.

Estas decisiones corresponden al alcance académico del proyecto y no deben modificarse unilateralmente durante la integración.

---

# 11. Instrucciones para agentes de IA

Al desarrollar o modificar el frontend:

1. Leer `agents.md`, `docs/database.md` y este documento antes de trabajar con la API.
2. Respetar los nombres de propiedades y estructuras JSON definidos por los contratos y DTOs del backend.
3. No inventar endpoints ni asumir que una ruta está implementada sin verificarlo.
4. Utilizar la instancia centralizada de Axios y mantener las llamadas HTTP en la capa de servicios.
5. Incorporar el token JWT mediante la configuración centralizada cuando corresponda.
6. No reemplazar silenciosamente las llamadas reales por mocks.
7. No considerar exitosa una operación hasta recibir una respuesta satisfactoria del backend.
8. Manejar correctamente los errores HTTP y sus distintos formatos.
9. Respetar las reglas de acceso por rol documentadas para cada endpoint.
10. Para las operaciones propias de un cliente, utilizar la identidad obtenida mediante el JWT y no enviar identificadores de usuario innecesarios.
11. Mantener los contratos de reservas y facturación de la sección 7.
12. Utilizar los identificadores válidos de los catálogos definidos para el proyecto.
13. No agregar endpoints de catálogos que no estén implementados.
14. Respetar las decisiones de alcance del proyecto: precios y promociones enviados desde el frontend, catálogos definidos en frontend, ausencia de expiración automática y confirmación sin pasarela de pago.
15. Si falta un contrato o existe una contradicción entre este documento y el código del backend, señalarlo antes de implementar una solución.
16. Considerar Swagger y los DTOs del backend como referencia para verificar los contratos efectivamente implementados.
17. Mantener diferenciados los endpoints implementados de aquellos cuyo contrato está definido pero cuya implementación todavía no fue verificada.

**Regla principal:** el frontend debe adaptarse al contrato acordado y a la implementación real del backend. No debe inventar rutas, propiedades ni comportamientos que no estén definidos.
