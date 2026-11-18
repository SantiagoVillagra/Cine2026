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

## 5.3. Consultar butacas de una función

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

# 7. Endpoints y funcionalidades pendientes

Las siguientes funcionalidades forman parte del sistema, pero no tienen actualmente un controlador HTTP implementado en el backend de la rama revisada.

No consumir estas rutas desde el frontend hasta que backend las implemente y confirme sus contratos.

## 7.1. Reservas

Todavía no se encuentra implementado un controlador de reservas.

Rutas previstas para una futura implementación:

| Método | Ruta propuesta                 | Propósito                                       |
| ------ | ------------------------------ | ----------------------------------------------- |
| POST   | `/api/reservas`                | Crear una reserva.                              |
| GET    | `/api/reservas/mis-reservas`   | Consultar las reservas del usuario autenticado. |
| GET    | `/api/reservas`                | Consultar reservas del sistema.                 |
| PATCH  | `/api/reservas/{id}/cancelar`  | Cancelar una reserva.                           |
| POST   | `/api/reservas/{id}/confirmar` | Confirmar una reserva y generar su factura.     |

Estas rutas son propuestas y no deben considerarse endpoints disponibles.

### Consideraciones para su futura implementación

- El cliente debe obtenerse del usuario autenticado, no de un `idCliente` enviado libremente por React.
- El backend debe validar la disponibilidad de cada butaca.
- Una butaca debe estar asociada a la sala de la función seleccionada.
- Los precios y descuentos deben calcularse en el backend.
- La operación debe manejarse mediante transacciones.
- Los conflictos de disponibilidad deberían responder con `409 Conflict`.
- La expiración y cancelación deben liberar las ocupaciones correspondientes sin borrar el historial.

## 7.2. Facturación

Actualmente no se encuentra implementado un controlador de facturas.

Rutas previstas:

| Método | Ruta propuesta       | Propósito                    |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/facturas`      | Registrar una venta directa. |
| GET    | `/api/facturas/{id}` | Consultar una factura.       |

Los contratos definitivos de request, response y permisos deben confirmarse cuando se implemente esta funcionalidad.

El esquema permite distinguir ventas provenientes de reservas de ventas directas:

- `Facturas.idReserva` puede ser `NULL`.
- `DetallesFacturas.idDetalleReserva` puede ser `NULL`.

## 7.3. Clientes y registro

El backend dispone de lógica de clientes utilizada por el login, pero actualmente no se encuentra un controlador de clientes con endpoints públicos de registro, consulta o edición.

No asumir que existen rutas como `/api/clientes`, `/api/registro` o similares hasta que se publiquen en Swagger.

---

# 8. Resumen de endpoints disponibles

| Método | Ruta                                      | Estado       | Acceso previsto                      |
| ------ | ----------------------------------------- | ------------ | ------------------------------------ |
| POST   | `/api/login`                              | Implementado | Público                              |
| GET    | `/api/peliculas`                          | Implementado | Público                              |
| GET    | `/api/peliculas/{id}`                     | Implementado | Sin restricción aplicada actualmente |
| POST   | `/api/peliculas`                          | Implementado | Admin previsto                       |
| PUT    | `/api/peliculas/{id}/estado`              | Implementado | Admin previsto                       |
| POST   | `/api/funciones`                          | Implementado | Admin previsto                       |
| GET    | `/api/funciones`                          | Implementado | Público                              |
| GET    | `/api/funciones/{id}/butacas`             | Implementado | Público                              |
| GET    | `/api/estadisticas/ingresos-por-mes`      | Implementado | Admin previsto                       |
| GET    | `/api/estadisticas/top-peliculas`         | Implementado | Admin previsto                       |
| GET    | `/api/estadisticas/ocupacion-por-horario` | Implementado | Admin previsto                       |
| GET    | `/api/estadisticas/uso-promociones`       | Implementado | Admin previsto                       |
| POST   | `/api/reservas`                           | Pendiente    | Por definir                          |
| GET    | `/api/reservas/mis-reservas`              | Pendiente    | Por definir                          |
| GET    | `/api/reservas`                           | Pendiente    | Por definir                          |
| PATCH  | `/api/reservas/{id}/cancelar`             | Pendiente    | Por definir                          |
| POST   | `/api/reservas/{id}/confirmar`            | Pendiente    | Por definir                          |
| POST   | `/api/facturas`                           | Pendiente    | Por definir                          |
| GET    | `/api/facturas/{id}`                      | Pendiente    | Por definir                          |

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

---

# 10. Consideraciones técnicas pendientes del backend

Antes de considerar completa la integración del frontend, deben revisarse los siguientes puntos:

1. **Autorización:** habilitar los atributos `[Authorize]` y `[Authorize(Roles = "Admin")]` correspondientes. Actualmente hay restricciones comentadas.
2. **CORS:** configurar una política que permita las solicitudes desde el origen utilizado por Vite durante el desarrollo.
3. **Login:** mantener la clave de firma JWT fuera del código fuente y utilizar configuración segura.
4. **Reservas:** implementar el controlador, DTOs, servicios y repositorios correspondientes.
5. **Facturación:** implementar los endpoints y definir sus DTOs.
6. **Clientes:** definir si se necesita un endpoint de registro y qué información podrá consultar o modificar el cliente.
7. **Swagger:** mantener la documentación actualizada con los contratos reales de request y response.
8. **Errores:** procurar que los errores tengan formatos consistentes para facilitar su manejo desde React.

---

# 11. Instrucciones para agentes de IA

Al desarrollar o modificar el frontend:

1. Leer `agents.md`, `docs/database.md` y este documento antes de trabajar con la API.
2. Respetar los nombres de propiedades y estructuras JSON definidos por los DTOs actuales.
3. No inventar endpoints ni asumir que las rutas pendientes ya están implementadas.
4. No enviar información sensible o datos que deban ser determinados por el servidor como si fueran confiables.
5. No calcular precios, descuentos ni disponibilidad definitiva desde React.
6. Mantener las llamadas HTTP separadas de los componentes visuales.
7. No reemplazar silenciosamente las llamadas reales por mocks.
8. No considerar exitosa una operación hasta recibir una respuesta satisfactoria del backend.
9. Manejar correctamente los errores HTTP.
10. Si falta un contrato o existe una contradicción entre este documento y el código, señalarlo antes de implementar una solución.
11. Considerar Swagger y los DTOs del backend como referencia para los contratos efectivamente implementados.
12. Mantener separados los contratos implementados y las propuestas de funcionalidades futuras.

**Regla principal:** el frontend debe adaptarse al contrato real del backend. No debe inventar ni asumir comportamientos que el servidor todavía no ofrece.
