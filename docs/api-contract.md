# API Contract – Proyecto de cine

**Tecnología backend:** ASP.NET Core Web API · Entity Framework Core · SQL Server  
**Frontend:** React + Vite  
**Estado:** documento de planificación consolidado; las rutas y DTOs son propuestas hasta que el backend confirme su implementación.

## 1. Propósito y criterio de uso

Este documento reúne la planificación de endpoints compartida por el equipo backend y las decisiones que ya se habían relevado para el frontend.

**Fuente principal:** `planificacion_endpoints_cine.pdf` (planificación de endpoints). Cuando el PDF define una ruta, método, acceso o estructura de datos, se conserva esa propuesta. Los puntos que el PDF no define se marcan como pendientes; no deben completarse por suposición.

Este documento describe el contrato HTTP propuesto. `database.md` describe el esquema SQL. Si una operación requiere una tabla o columna que todavía no está en el esquema SQL documentado, se señala explícitamente.

## 2. Criterios generales

- El backend protege los endpoints y valida permisos. Ocultar botones o proteger rutas en React no reemplaza la autorización del servidor.
- El `idCliente` de un usuario autenticado se obtiene del claim del JWT. No confiar en un `idCliente` enviado por el frontend para operaciones del propio usuario.
- El frontend envía solamente los datos que el usuario puede elegir. El backend calcula precios, promociones, fechas de servidor y estados.
- No aceptar `esAdmin`, precios, descuentos ni estados como datos confiables enviados por el frontend.
- Separar lectura y escritura: `GET` consulta; `POST` crea; `PUT`/`PATCH` modifica.
- Utilizar DTOs para requests y responses; no exponer directamente entidades EF Core.
- Validar en backend las relaciones, la vigencia de películas y funciones, la disponibilidad de butacas, la propiedad de reservas y el estado de pago.
- Operaciones relacionadas deben ejecutarse dentro de transacciones.
- Respuestas HTTP propuestas:
  - `200 OK`: consulta o modificación con respuesta.
  - `201 Created`: creación exitosa.
  - `400 Bad Request`: datos inválidos.
  - `401 Unauthorized`: falta autenticación válida.
  - `403 Forbidden`: usuario autenticado sin permisos.
  - `404 Not Found`: recurso inexistente.
  - `409 Conflict`: conflicto de disponibilidad o estado.

## 3. Autenticación y autorización

### 3.1. JWT

La planificación indica que el login debe permitir acceso anónimo (`[AllowAnonymous]`) y, si las credenciales son correctas, emitir un JWT con identificador, email y rol.

El rol debe incorporarse como claim de rol (por ejemplo, `ClaimTypes.Role`) con los valores `Admin` o `Client`. Para obtener el identificador del cliente autenticado, el backend puede leer `ClaimTypes.NameIdentifier`.

### 3.2. Reglas de acceso

- Catálogo de películas y consulta de funciones: públicos, si el negocio decide que se puedan consultar sin iniciar sesión.
- Operaciones administrativas: `[Authorize(Roles = "Admin")]`.
- Operaciones de clientes: `[Authorize(Roles = "Client")]`.
- Operaciones permitidas al dueño del recurso o a Admin: autenticar y validar la propiedad en controller/servicio.
- Venta directa: Admin o personal autorizado de boletería. El rol concreto para ese personal todavía debe definirse.

### 3.3. Registro y login

En la planificación PDF no aparecen rutas ni DTOs detallados para registro y login. En el relevamiento anterior se había contemplado:
- Registro de cliente: datos personales y credenciales.
- Login: email y contraseña; respuesta con JWT e información suficiente para identificar al usuario y su rol.

**Pendiente:** confirmar rutas, nombres de propiedades, validaciones, formato exacto de la respuesta JWT, expiración/renovación del token y si el registro público estará habilitado. No inventar esos contratos en el frontend.

## 4. Películas

### 4.1. Listado de películas

`GET /api/peliculas`

- **Acceso propuesto:** público, si el catálogo se ofrece sin login.
- **Uso:** obtener los datos necesarios para tarjetas o listados.
- **Respuesta sugerida por el PDF:** `idPelicula`, `titulo`, `poster`, `clasificacion` y `generos`.

Ejemplo de respuesta:

```json
[
  {
    "idPelicula": 12,
    "titulo": "Título de ejemplo",
    "poster": "/ruta/poster.jpg",
    "clasificacion": "ATP",
    "generos": ["Acción", "Aventura"]
  }
]
```

### 4.2. Detalle de película

`GET /api/peliculas/{id}`

- **Acceso propuesto:** público.
- **Uso:** consultar información completa de una película.
- **Respuesta posible:** título, duración, clasificación, director, fecha de estreno, póster, sinopsis, géneros y funciones disponibles.
- La planificación recomienda no incluir todas las butacas en esta respuesta: la disponibilidad cambia y se consulta por función.

Ejemplo orientativo:

```json
{
  "idPelicula": 12,
  "titulo": "Título de ejemplo",
  "duracion": 125,
  "clasificacion": "ATP",
  "director": "Nombre del director",
  "fechaEstreno": "2026-10-01",
  "poster": "/ruta/poster.jpg",
  "sinopsis": "...",
  "generos": ["Acción", "Aventura"],
  "funciones": [
    {
      "idFuncion": 45,
      "fecha": "2026-11-20",
      "hora": "20:30",
      "sala": "Sala 2"
    }
  ]
}
```

### 4.3. Activar o desactivar película

`PUT /api/peliculas/{id}/estado`

- **Acceso propuesto:** Admin.
- **Uso:** cambiar el estado de una película sin eliminarla físicamente.
- **Body propuesto:**

```json
{
  "activa": false
}
```

- El backend debe comprobar que la película exista y que el cambio sea válido.
- Una película inactiva no debería ofrecerse para nuevas funciones; se puede conservar el historial de funciones anteriores.

**Dependencia del esquema:** el PDF aclara que, si `Activa` todavía no existe en SQL Server y en la entidad `Pelicula`, debe incorporarse antes. La columna no estaba en el SQL original documentado en `database.md`. No asumir que ya existe.

### 4.4. Alta de película

`POST /api/peliculas`

- **Acceso propuesto:** Admin.
- **Uso:** crear una película y sus relaciones con géneros y actores.
- El frontend envía identificadores de clasificación y director, datos propios de la película y arrays de IDs de géneros y actores.
- El backend valida que las referencias existan y crea las filas de `PeliculasGeneros` y `ActoresPeliculas`.

Body propuesto:

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

## 5. Funciones

### 5.1. Programar función

`POST /api/funciones`

- **Acceso propuesto:** Admin.
- **Uso:** programar una función.

Body propuesto:

```json
{
  "fecha": "2026-11-20",
  "idHoraFuncion": 4,
  "subtitulada": false,
  "idPelicula": 12,
  "idSala": 2,
  "idIdioma": 1
}
```

Validaciones indicadas por el PDF:
- Verificar que existan película, sala, idioma y horario.
- Verificar que la película esté activa.
- Verificar que la sala no tenga otra función superpuesta.
- Comparar intervalos de inicio y fin, no solamente la hora de inicio. Si corresponde, agregar un margen de limpieza/preparación.
- Obtener la duración desde la película almacenada en la base de datos; no confiar en una duración enviada por el frontend.

### 5.2. Consultar funciones

`GET /api/funciones`

- **Acceso propuesto:** público.
- **Uso:** consultar funciones.
- **Filtros opcionales sugeridos:** fecha e `idPelicula`.

Ejemplo:

`GET /api/funciones?fecha=2026-11-20&idPelicula=12`

### 5.3. Consultar butacas y disponibilidad de una función

`GET /api/funciones/{id}/butacas`

- **Acceso propuesto:** público.
- **Uso:** obtener el plano de butacas de una función con su disponibilidad actual.
- La disponibilidad se calcula para la combinación de función y butaca. Una butaca física puede estar ocupada en una función y libre en otra.
- No usar `Butacas.reservada` como indicador global.

Ejemplo de respuesta:

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

## 6. Reservas

### 6.1. Crear reserva

`POST /api/reservas`

- **Acceso propuesto:** usuario autenticado con rol `Client`.
- **Uso:** iniciar una reserva con una o varias butacas.
- El body contiene solamente los datos elegidos por el usuario: función, butaca y tipo de entrada.
- No enviar como datos confiables `idCliente`, fecha/hora, estado, precio ni promoción.
- El backend obtiene el cliente desde el JWT, toma fecha/hora del servidor y calcula precios y promociones.

Body propuesto:

```json
{
  "detalles": [
    {
      "idFuncion": 45,
      "idButaca": 31,
      "idTipoEntrada": 1
    },
    {
      "idFuncion": 45,
      "idButaca": 32,
      "idTipoEntrada": 2
    }
  ]
}
```

Validaciones mínimas:
- Que cada función y butaca existan.
- Que la butaca pertenezca a la sala de esa función.
- Que las funciones sean válidas y no estén vencidas.
- Que no haya butacas repetidas dentro de la solicitud.
- Que cada combinación `(idFuncion, idButaca)` esté disponible.
- Calcular precio y promociones válidas en backend.
- Insertar reserva, detalles y ocupaciones dentro de una única transacción.
- Si otra solicitud ocupa la misma butaca simultáneamente, responder `409 Conflict`.

### 6.2. Cancelar reserva

`PATCH /api/reservas/{id}/cancelar`

- **Acceso propuesto:** cliente dueño de la reserva o Admin, según reglas del negocio.
- **Uso:** cancelar una reserva.
- No requiere enviar el nuevo estado en el body.
- El backend verifica existencia, propiedad (salvo Admin) y que la reserva todavía pueda cancelarse.
- No permitir cancelar como pendiente una reserva que ya fue facturada.
- Al cancelar una reserva no facturada, liberar las ocupaciones correspondientes en `OcupacionesButacas`, conservando los detalles históricos.

### 6.3. Consultar reservas propias

`GET /api/reservas/mis-reservas`

- **Acceso propuesto:** Client.
- **Uso:** devolver las reservas del usuario autenticado.
- El `idCliente` se obtiene del JWT, no de un parámetro manipulable enviado por el frontend.

### 6.4. Consultar todas las reservas

`GET /api/reservas`

- **Acceso propuesto:** Admin.
- **Uso:** consultar reservas del sistema.
- Filtros sugeridos: fecha, estado o cliente.
- Paginación sugerida si el volumen de datos crece.

### 6.5. Confirmar reserva y generar factura

`POST /api/reservas/{id}/confirmar`

- **Acceso propuesto:** dueño de la reserva o Admin, según el flujo de compra.
- **Uso:** confirmar el pago y generar la factura.
- El body puede contener `idFormaPago` y, si corresponde, `idCanalVenta`.
- El backend carga los detalles de la reserva; el frontend no vuelve a enviar precios, funciones ni butacas.

En una sola transacción, el backend debe:
1. Comprobar que la reserva esté vigente y no facturada.
2. Verificar que los detalles sigan siendo válidos.
3. Crear `Factura` y `DetallesFacturas`.
4. Asociar cada detalle de factura con el detalle de reserva correspondiente.
5. Actualizar `fechaHoraConfirmacion`.
6. Completar la referencia a la factura en `OcupacionesButacas`.

La ocupación no se libera: la butaca continúa vendida.

**Body exacto:** el PDF no fija un ejemplo JSON completo. No asumir que solo `idFormaPago` es obligatorio ni inventar propiedades adicionales hasta que backend confirme.

## 7. Facturación y ventas directas

### 7.1. Registrar venta directa

`POST /api/facturas`

- **Acceso propuesto:** Admin o personal autorizado de boletería.
- **Uso:** registrar una venta directa que no proviene de una reserva web.
- En este caso puede tener sentido recibir `idCliente`, porque el operador registra una venta para un cliente. Si se admiten ventas anónimas, debe definirse esa regla.
- Fecha de emisión, precios y promociones se calculan en backend.

Body propuesto:

```json
{
  "idCliente": 25,
  "idFormaPago": 1,
  "idCanalVenta": 1,
  "detalles": [
    {
      "idFuncion": 45,
      "idButaca": 35,
      "idTipoEntrada": 1
    }
  ]
}
```

El backend debe validar disponibilidad y crear `Factura`, `DetallesFacturas` y `OcupacionesButacas` dentro de una única transacción. Para una venta directa, `idDetalleReserva` queda `NULL` y la ocupación referencia `idDetalleFactura`.

### 7.2. Consultar factura

`GET /api/facturas/{id}`

- **Acceso:** según permisos; debe controlarse que el usuario pueda consultar esa factura.
- **Uso:** obtener el comprobante.
- **Respuesta esperada:** datos de factura, cliente, forma/canal de pago y detalles con película, función, sala, butaca, tipo de entrada y precio.

**Pendiente:** el PDF recomienda el endpoint, pero no define un JSON de respuesta ni todas las reglas de acceso.

## 8. Modelo de ocupación de butacas y concurrencia

La planificación propone una tabla adicional `OcupacionesButacas` que registra una ocupación por cada par de función y butaca, con clave primaria compuesta:

| Columna | Clave / nulabilidad |
|---|---|
| `idFuncion` | PK, FK |
| `idButaca` | PK, FK |
| `idDetalleReserva` | FK, nullable |
| `idDetalleFactura` | FK, nullable |

Casos contemplados:
- **Reserva pendiente:** `idDetalleReserva` informado; `idDetalleFactura` `NULL`.
- **Reserva pagada:** se mantienen ambos vínculos, reserva y factura.
- **Venta directa:** `idDetalleFactura` informado; `idDetalleReserva` `NULL`.
- **Cancelación o expiración antes del pago:** se elimina la ocupación, pero se conserva el detalle histórico de la reserva.

La clave primaria compuesta impide dos ocupaciones para la misma butaca en la misma función. La inserción de reserva, detalles y ocupaciones debe ser transaccional. El backend debe capturar el conflicto por clave duplicada y traducirlo a HTTP `409`.

Se recomienda dejar de utilizar `Butacas.reservada` como indicador de disponibilidad, porque no distingue funciones. La disponibilidad se obtiene consultando `OcupacionesButacas` por `idFuncion`.

**Cambio de base de datos requerido:** `OcupacionesButacas` no forma parte de las 24 tablas del SQL original documentado en `database.md`. Debe incorporarse al esquema y a las entidades/configuración EF Core antes de depender de este mecanismo. Este documento registra la propuesta del PDF; no implica que la tabla ya exista.

## 9. Expiración de reservas

La planificación establece que las reservas no confirmadas expiran dos horas antes de la función. Para cumplirlo se necesita un proceso automático del backend (por ejemplo, un servicio en segundo plano o tarea programada); no alcanza con liberar butacas cuando un usuario vuelve a consultar.

**Caso que debe definirse:** si una reserva contiene detalles correspondientes a funciones con distintos horarios, cada función puede comenzar en un momento diferente. Para liberar cada butaca exactamente dos horas antes de su función, el estado a nivel de reserva puede ser insuficiente. El PDF propone dos alternativas:
- Agregar estado/fecha de expiración por detalle de reserva.
- Definir explícitamente que toda la reserva se cancela como una unidad.

Al expirar:
- Marcar el registro o detalle como vencido y liberar su fila de `OcupacionesButacas`.
- No borrar los detalles históricos de la reserva.
- No liberar una ocupación que ya tenga factura asociada.
- Hacer el proceso idempotente: ejecutarlo varias veces no debe generar inconsistencias.

**Relación con `Reservas.estado`:** en la aclaración previa del backend se indicó que `0` significa cancelada y `1` no cancelada, y que una reserva nueva se crea con `true`. Eso no define por sí solo cómo distinguir pendiente, confirmada, vencida y cancelada. Debe acordarse cómo se representará la expiración y el pago sin contradecir esa semántica.

## 10. Resumen de endpoints propuestos

| Método | Ruta | Acceso propuesto | Propósito |
|---|---|---|---|
| GET | `/api/peliculas` | Público | Listado/catálogo |
| GET | `/api/peliculas/{id}` | Público | Detalle de película |
| POST | `/api/peliculas` | Admin | Alta de película y relaciones |
| PUT | `/api/peliculas/{id}/estado` | Admin | Activar/desactivar |
| POST | `/api/funciones` | Admin | Programar función |
| GET | `/api/funciones` | Público | Consultar funciones |
| GET | `/api/funciones/{id}/butacas` | Público | Disponibilidad de butacas |
| POST | `/api/reservas` | Client | Crear reserva |
| PATCH | `/api/reservas/{id}/cancelar` | Dueño/Admin | Cancelar reserva |
| GET | `/api/reservas/mis-reservas` | Client | Reservas propias |
| GET | `/api/reservas` | Admin | Consultar reservas |
| POST | `/api/reservas/{id}/confirmar` | Dueño/Admin | Pagar y facturar reserva |
| POST | `/api/facturas` | Admin/Personal autorizado | Venta directa |
| GET | `/api/facturas/{id}` | Según permisos | Consultar comprobante |

Las rutas y permisos son propuestas de la planificación; deben cotejarse con las rutas reales de Swagger/OpenAPI cuando backend las publique.

## 11. Diferencias y dependencias respecto del esquema SQL documentado

1. **`OcupacionesButacas`:** tabla nueva propuesta por el PDF; no está en las 24 tablas del SQL original. Requiere cambio de esquema, claves foráneas y clave primaria compuesta `(idFuncion, idButaca)`.
2. **`Peliculas.Activa`:** el PDF confirma que debe agregarse si todavía no existe. No figura en el SQL original documentado.
3. **`Butacas.reservada`:** no debe usarse como disponibilidad global. La disponibilidad se calcula por función y butaca mediante ocupaciones.
4. **`Reservas.estado`:** se informó que `0` es cancelada y `1` no cancelada. La expiración y la confirmación de pago necesitan una definición de estado complementaria o reglas adicionales.
5. **Venta directa:** el PDF propone que el frontend de boletería envíe `idCliente` si corresponde; definir si se permiten ventas anónimas.
6. **Roles:** están propuestos `Admin` y `Client`; falta definir el rol/permisos concretos de personal de boletería.
7. **Formato 2D/3D:** según la aclaración del backend, corresponde a `Salas`, no a `Peliculas` ni a `Funciones`. El frontend puede derivarlo de la sala asociada a la función, siempre que la API exponga ese dato.
8. **Registro/login:** el PDF describe criterios JWT, pero no define rutas ni DTOs completos.
9. **Expiración:** falta decidir si una reserva con funciones de distintos horarios expira como unidad o por detalle.

## 12. Pendientes de confirmación antes de integrar el frontend

- Rutas definitivas y nombres exactos de todos los endpoints.
- DTOs finales de request y response, incluidos campos opcionales y formatos de fecha/hora.
- Contrato de registro y login; estructura del JWT, claims, expiración y eventual refresh.
- Confirmar si el catálogo y las funciones serán públicos.
- Confirmar rol y permisos del personal de boletería.
- Confirmar si se permiten ventas anónimas.
- Incorporar `Peliculas.Activa` al esquema o documentar la alternativa.
- Incorporar `OcupacionesButacas` y su configuración EF Core.
- Definir estados de reserva, expiración y confirmación sin ambigüedades.
- Definir cómo se expiran reservas que contienen funciones con distintos horarios.
- Definir el body de confirmación de reserva y la respuesta de creación de reserva/venta.
- Definir la respuesta de `GET /api/facturas/{id}` y quién puede consultarla.
- Confirmar filtros, paginación y ordenamiento de listados.
- Publicar Swagger/OpenAPI actualizado para que el frontend consuma el contrato real.

## 13. Instrucciones para agentes de IA

Al implementar el frontend:
1. Leer `AGENTS.md`, `docs/requirements.md`, `docs/database.md` y este documento antes de realizar cambios relacionados con la API.
2. Tratar las rutas y DTOs de este documento como planificación, no como garantía de que ya están implementados.
3. No inventar endpoints, parámetros, propiedades JSON, respuestas ni códigos HTTP.
4. No enviar desde React `idCliente`, roles, precios, descuentos o estados como datos confiables en operaciones autenticadas.
5. Obtener el token y la identidad del usuario según el contrato real de autenticación que confirme backend.
6. Mantener las llamadas HTTP en la capa de servicios, separadas de los componentes visuales.
7. Mantener mocks separados de las llamadas reales; no presentar mocks como respuestas del servidor.
8. No considerar exitosa una reserva, cancelación, confirmación o compra hasta recibir una respuesta satisfactoria de la API.
9. Manejar `401`, `403`, `404` y especialmente `409 Conflict` en la selección y compra de butacas.
10. Si falta un dato o hay una contradicción entre este documento, `database.md` y Swagger, detenerse y señalar el punto pendiente en vez de asumir una solución.
11. El contrato definitivo de Swagger/OpenAPI y las decisiones confirmadas por backend prevalecen sobre esta planificación.
