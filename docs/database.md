# Database – BDI_TP_DbCine

## 1. Información general

Base de datos: `BDI_TP_DbCine`  
Motor: Microsoft SQL Server  
Cantidad de tablas: 24

Este documento describe la estructura de la base de datos utilizada por el sistema de gestión de cine.

El esquema contempla:

- Gestión de clientes.
- Catálogo de películas y sus características.
- Salas, butacas y tipos de sala.
- Programación de funciones.
- Tipos de entrada y promociones.
- Reservas de entradas.
- Compra y facturación.

**Fuente de verdad:** el script SQL de creación de tablas. No se deben asumir columnas, relaciones, endpoints ni reglas de negocio que no estén definidos en el esquema o confirmados por el backend.

---

## 2. Tablas y columnas

### 2.1. Clientes

Almacena los datos de los clientes registrados en el sistema.

| Columna    | Tipo              | Nulable | Descripción                   |
| ---------- | ----------------- | ------- | ----------------------------- |
| idCliente  | int IDENTITY(1,1) | No      | Identificador del cliente. PK |
| nombre     | varchar(100)      | No      | Nombre                        |
| apellido   | varchar(100)      | No      | Apellido                      |
| dni        | varchar(20)       | No      | Documento                     |
| email      | varchar(150)      | No      | Correo electrónico            |
| telefono   | varchar(30)       | Sí      | Teléfono                      |
| contraseña | varchar(255)      | No      | Credencial almacenada         |

### 2.2. CanalesVenta

Canales por los que se realizan las ventas.

| Columna      | Tipo              | Nulable | Descripción       |
| ------------ | ----------------- | ------- | ----------------- |
| idCanalVenta | int IDENTITY(1,1) | No      | Identificador. PK |
| descripcion  | varchar(50)       | No      | Nombre del canal  |

### 2.3. FormasPago

Medios de pago disponibles.

| Columna     | Tipo              | Nulable | Descripción                   |
| ----------- | ----------------- | ------- | ----------------------------- |
| idFormaPago | int IDENTITY(1,1) | No      | Identificador. PK             |
| descripcion | varchar(50)       | No      | Descripción del medio de pago |

### 2.4. HorasFuncion

Horarios disponibles para las funciones.

| Columna       | Tipo              | Nulable | Descripción        |
| ------------- | ----------------- | ------- | ------------------ |
| idHoraFuncion | int IDENTITY(1,1) | No      | Identificador. PK  |
| horaFuncion   | time              | No      | Hora de la función |

### 2.5. Promociones

Promociones y descuentos aplicables a entradas.

| Columna             | Tipo              | Nulable | Descripción             |
| ------------------- | ----------------- | ------- | ----------------------- |
| idPromocion         | int IDENTITY(1,1) | No      | Identificador. PK       |
| descripcion         | varchar(200)      | No      | Descripción             |
| porcentajeDescuento | decimal(5,2)      | No      | Porcentaje de descuento |
| fechaDesde          | date              | No      | Inicio de vigencia      |
| fechaHasta          | date              | No      | Fin de vigencia         |

### 2.6. PromocionesDias

Días de la semana en los que se aplica una promoción.

| Columna        | Tipo              | Nulable | Descripción            |
| -------------- | ----------------- | ------- | ---------------------- |
| idPromocionDia | int IDENTITY(1,1) | No      | Identificador. PK      |
| diaSemana      | varchar(20)       | No      | Día de la semana       |
| idPromocion    | int               | No      | Promoción asociada. FK |

### 2.7. PromocionesHorarios

Horarios en los que se aplica una promoción.

| Columna            | Tipo              | Nulable | Descripción            |
| ------------------ | ----------------- | ------- | ---------------------- |
| idPromocionHorario | int IDENTITY(1,1) | No      | Identificador. PK      |
| idHoraFuncion      | int               | No      | Horario asociado. FK   |
| idPromocion        | int               | No      | Promoción asociada. FK |

### 2.8. TiposEntrada

Categorías de entradas disponibles.

| Columna       | Tipo              | Nulable | Descripción          |
| ------------- | ----------------- | ------- | -------------------- |
| idTipoEntrada | int IDENTITY(1,1) | No      | Identificador. PK    |
| descripcion   | varchar(50)       | No      | Descripción del tipo |

### 2.9. TiposSala

Categorías de salas y su precio base.

| Columna     | Tipo              | Nulable | Descripción                  |
| ----------- | ----------------- | ------- | ---------------------------- |
| idTipoSala  | int IDENTITY(1,1) | No      | Identificador. PK            |
| descripcion | varchar(50)       | No      | Descripción del tipo de sala |
| precio      | decimal(10,2)     | No      | Precio asociado al tipo      |

### 2.10. Salas

Salas físicas del cine.

| Columna    | Tipo              | Nulable | Descripción            |
| ---------- | ----------------- | ------- | ---------------------- |
| idSala     | int IDENTITY(1,1) | No      | Identificador. PK      |
| numeroSala | int               | No      | Número visible de sala |
| capacidad  | int               | No      | Capacidad declarada    |
| idTipoSala | int               | No      | Tipo de sala. FK       |

**Aclaración confirmada por backend:** el formato de proyección (2D/3D) corresponde a la sala. En los datos actuales, las salas 1 y 2 son 2D y la sala 3 es 3D. El formato no está representado por una columna específica en el esquema SQL documentado; no inventar un campo `formato` ni asociarlo a películas o funciones.

### 2.11. Butacas

Butacas pertenecientes a una sala.

| Columna   | Tipo              | Nulable | Descripción                 |
| --------- | ----------------- | ------- | --------------------------- |
| idButaca  | int IDENTITY(1,1) | No      | Identificador. PK           |
| fila      | varchar(10)       | No      | Fila                        |
| numero    | int               | No      | Número de butaca            |
| idSala    | int               | No      | Sala a la que pertenece. FK |
| reservada | bit               | Sí      | Indicador de reserva        |

**Importante:** la tabla relaciona cada butaca con una sala, pero no contiene una relación directa con una función. La disponibilidad debe determinarse para cada combinación de `idFuncion` + `idButaca`, considerando las reservas no canceladas y las ventas asociadas a esa función.

No utilizar `reservada` como estado global de la butaca: una misma butaca puede estar disponible para una función y ocupada para otra. El mecanismo definitivo de consulta, bloqueo temporal y confirmación de disponibilidad todavía debe ser definido por backend.

### 2.12. Idiomas

Idiomas disponibles para las funciones.

| Columna     | Tipo              | Nulable | Descripción       |
| ----------- | ----------------- | ------- | ----------------- |
| idIdioma    | int IDENTITY(1,1) | No      | Identificador. PK |
| descripcion | varchar(50)       | No      | Idioma            |

### 2.13. Clasificaciones

Clasificaciones de edad de las películas.

| Columna         | Tipo              | Nulable | Descripción       |
| --------------- | ----------------- | ------- | ----------------- |
| idClasificacion | int IDENTITY(1,1) | No      | Identificador. PK |
| descripcion     | varchar(20)       | No      | Clasificación     |

### 2.14. Directores

Directores de películas.

| Columna    | Tipo              | Nulable | Descripción         |
| ---------- | ----------------- | ------- | ------------------- |
| idDirector | int IDENTITY(1,1) | No      | Identificador. PK   |
| nombre     | varchar(100)      | No      | Nombre del director |

### 2.15. Generos

Géneros cinematográficos.

| Columna  | Tipo              | Nulable | Descripción       |
| -------- | ----------------- | ------- | ----------------- |
| idGenero | int IDENTITY(1,1) | No      | Identificador. PK |
| nombre   | varchar(50)       | No      | Nombre del género |

### 2.16. Actores

Actores que participan en películas.

| Columna | Tipo              | Nulable | Descripción       |
| ------- | ----------------- | ------- | ----------------- |
| idActor | int IDENTITY(1,1) | No      | Identificador. PK |
| nombre  | varchar(100)      | No      | Nombre del actor  |

### 2.17. Peliculas

Información del catálogo de películas.

| Columna         | Tipo              | Nulable | Descripción                  |
| --------------- | ----------------- | ------- | ---------------------------- |
| idPelicula      | int IDENTITY(1,1) | No      | Identificador. PK            |
| titulo          | varchar(200)      | No      | Título                       |
| duracion        | int               | No      | Duración                     |
| idClasificacion | int               | No      | Clasificación. FK            |
| idDirector      | int               | No      | Director. FK                 |
| fechaEstreno    | date              | No      | Fecha de estreno             |
| poster          | varchar(100)      | No      | Referencia o ruta del póster |
| sinopsis        | varchar(MAX)      | Sí      | Sinopsis                     |

La unidad de duración no está especificada en el esquema. Confirmar con backend si se expresa en minutos.

`poster` es un campo de texto que almacena una referencia o ruta. No se debe asumir que contiene una URL pública completa sin confirmarlo.

**Pendiente de esquema:** backend propone utilizar `Peliculas.Activa` (booleano) para indicar si una película está activa o inactiva. Esa columna no aparece en el SQL original documentado. No asumir que existe en la base de datos hasta que se incorpore al esquema o backend confirme una alternativa.

### 2.18. PeliculasGeneros

Tabla intermedia para la relación muchos a muchos entre películas y géneros.

| Columna          | Tipo              | Nulable | Descripción       |
| ---------------- | ----------------- | ------- | ----------------- |
| idPeliculaGenero | int IDENTITY(1,1) | No      | Identificador. PK |
| idPelicula       | int               | No      | Película. FK      |
| idGenero         | int               | No      | Género. FK        |

### 2.19. ActoresPeliculas

Tabla intermedia para la relación muchos a muchos entre actores y películas.

| Columna         | Tipo              | Nulable | Descripción       |
| --------------- | ----------------- | ------- | ----------------- |
| idActorPelicula | int IDENTITY(1,1) | No      | Identificador. PK |
| idActor         | int               | No      | Actor. FK         |
| idPelicula      | int               | No      | Película. FK      |

### 2.20. Funciones

Funciones programadas para proyectar películas.

| Columna       | Tipo              | Nulable | Descripción              |
| ------------- | ----------------- | ------- | ------------------------ |
| idFuncion     | int IDENTITY(1,1) | No      | Identificador. PK        |
| fecha         | date              | No      | Fecha de la función      |
| idHoraFuncion | int               | No      | Horario. FK              |
| subtitulada   | bit               | No      | Indica si es subtitulada |
| idPelicula    | int               | No      | Película proyectada. FK  |
| idSala        | int               | No      | Sala asignada. FK        |
| idIdioma      | int               | No      | Idioma. FK               |

El formato 2D/3D corresponde a `Salas`, según la aclaración confirmada por backend. Una función queda asociada a una sala mediante `idSala`, por lo que el formato de una función puede determinarse a partir de su sala. No asociar el formato directamente a `Peliculas` ni agregar una propiedad no confirmada al modelo de funciones.

### 2.21. Reservas

Reservas realizadas por clientes.

| Columna               | Tipo              | Nulable | Descripción                  |
| --------------------- | ----------------- | ------- | ---------------------------- |
| idReserva             | int IDENTITY(1,1) | No      | Identificador. PK            |
| fechaHoraReserva      | datetime          | No      | Fecha y hora de creación     |
| idCliente             | int               | No      | Cliente. FK                  |
| estado                | bit               | No      | Estado de la reserva         |
| fechaHoraConfirmacion | datetime          | Sí      | Fecha y hora de confirmación |

**Aclaración confirmada por backend:** `estado = 0` indica que la reserva está cancelada y `estado = 1` indica que no está cancelada. Una reserva nueva se crea con `estado = true`.

Este campo no representa por sí solo todos los estados posibles del flujo (por ejemplo, pago o confirmación); no inferir estados adicionales sin una regla confirmada por backend.

### 2.22. DetallesReservas

Entradas y butacas incluidas en una reserva.

| Columna          | Tipo              | Nulable | Descripción            |
| ---------------- | ----------------- | ------- | ---------------------- |
| idDetalleReserva | int IDENTITY(1,1) | No      | Identificador. PK      |
| idReserva        | int               | No      | Reserva. FK            |
| idFuncion        | int               | No      | Función. FK            |
| idButaca         | int               | No      | Butaca. FK             |
| idTipoEntrada    | int               | No      | Tipo de entrada. FK    |
| precio           | decimal(10,2)     | No      | Precio de la entrada   |
| idPromocion      | int               | Sí      | Promoción aplicada. FK |

Cada registro representa un detalle de una reserva asociado a una función, una butaca y un tipo de entrada.

### 2.23. Facturas

Comprobantes de compras realizadas por clientes.

| Columna          | Tipo              | Nulable | Descripción             |
| ---------------- | ----------------- | ------- | ----------------------- |
| idFactura        | int IDENTITY(1,1) | No      | Identificador. PK       |
| fechaHoraEmision | datetime          | No      | Fecha y hora de emisión |
| idReserva        | int               | Sí      | Reserva asociada. FK    |
| idCliente        | int               | No      | Cliente. FK             |
| idFormaPago      | int               | No      | Forma de pago. FK       |
| idCanalVenta     | int               | No      | Canal de venta. FK      |

**Importante:** `idReserva` admite `NULL`. Esto permite representar compras directas, sin una reserva previa.

Por lo tanto, no asumir que toda factura tiene una reserva asociada.

### 2.24. DetallesFacturas

Entradas incluidas en una factura.

| Columna          | Tipo              | Nulable | Descripción                     |
| ---------------- | ----------------- | ------- | ------------------------------- |
| idDetalleFactura | int IDENTITY(1,1) | No      | Identificador. PK               |
| precioUnitario   | decimal(10,2)     | No      | Precio base de la entrada       |
| idFactura        | int               | No      | Factura. FK                     |
| idFuncion        | int               | No      | Función. FK                     |
| idPromocion      | int               | Sí      | Promoción aplicada. FK          |
| idButaca         | int               | No      | Butaca. FK                      |
| idDetalleReserva | int               | Sí      | Detalle de reserva asociado. FK |
| idTipoEntrada    | int               | No      | Tipo de entrada. FK             |

Cada registro representa una entrada vendida.

**Importante:**

- `precioUnitario` representa el precio base.
- Si existe una promoción, el descuento se obtiene mediante `idPromocion` y `Promociones.porcentajeDescuento`.
- `idDetalleReserva` admite `NULL`, permitiendo registrar ventas directas que no provienen de una reserva.

---

## 3. Relaciones entre tablas

### 3.1. Clientes y operaciones

- `Clientes (1) → (N) Reservas`
- `Clientes (1) → (N) Facturas`

Un cliente puede realizar varias reservas y compras.

### 3.2. Películas y catálogo

- `Clasificaciones (1) → (N) Peliculas`
- `Directores (1) → (N) Peliculas`
- `Peliculas (N) ↔ (N) Generos`, mediante `PeliculasGeneros`.
- `Peliculas (N) ↔ (N) Actores`, mediante `ActoresPeliculas`.

Una película tiene un director y una clasificación. Puede asociarse con varios géneros y actores.

### 3.3. Salas y funciones

- `TiposSala (1) → (N) Salas`
- `Salas (1) → (N) Butacas`
- `Salas (1) → (N) Funciones`
- `Peliculas (1) → (N) Funciones`
- `Idiomas (1) → (N) Funciones`
- `HorasFuncion (1) → (N) Funciones`

Una función está asociada a una película, una sala, un idioma y un horario.

### 3.4. Reservas

- `Reservas (1) → (N) DetallesReservas`
- `Funciones (1) → (N) DetallesReservas`
- `Butacas (1) → (N) DetallesReservas`
- `TiposEntrada (1) → (N) DetallesReservas`
- `Promociones (1) → (N) DetallesReservas`

Una reserva puede contener varios detalles. Cada detalle corresponde a una función, una butaca y un tipo de entrada.

### 3.5. Facturación

- `Facturas (1) → (N) DetallesFacturas`
- `Facturas (N) → (1) Clientes`
- `Facturas (N) → (1) FormasPago`
- `Facturas (N) → (1) CanalesVenta`
- `Facturas (N) → (0..1) Reservas`
- `Funciones (1) → (N) DetallesFacturas`
- `Butacas (1) → (N) DetallesFacturas`
- `TiposEntrada (1) → (N) DetallesFacturas`
- `Promociones (1) → (N) DetallesFacturas`
- `DetallesReservas (1) → (0..N) DetallesFacturas`, según las claves foráneas definidas.

Una factura puede estar asociada a una reserva o corresponder a una compra directa.

### 3.6. Promociones

- `Promociones (1) → (N) PromocionesDias`
- `Promociones (1) → (N) PromocionesHorarios`
- `HorasFuncion (1) → (N) PromocionesHorarios`

Las promociones pueden tener días y horarios asociados. También pueden aparecer asociadas a los detalles de reservas y facturas.

---

## 4. Reglas y consideraciones para el frontend

Esta sección contiene criterios importantes para implementar correctamente las funcionalidades. Las reglas que no están garantizadas por restricciones SQL deben validarse mediante el backend.

### 4.1. Catálogo de películas

Para mostrar una película se pueden utilizar:

- Título.
- Póster.
- Sinopsis.
- Duración.
- Fecha de estreno.
- Clasificación.
- Director.
- Géneros.
- Actores.

Los géneros y actores pueden requerir datos relacionados obtenidos mediante las tablas intermedias.

### 4.2. Funciones

Una función reúne:

- Una película.
- Una fecha.
- Un horario.
- Una sala.
- Un idioma.
- La condición de subtitulada o no.

El frontend debe obtener las funciones disponibles desde la API. No debe calcular ni inventar disponibilidad a partir de los datos del catálogo.

### 4.3. Selección de butacas

La selección de butacas debe estar vinculada a una función específica.

La disponibilidad debe calcularse por combinación de `IdFuncion` + `IdButaca`, considerando las reservas no canceladas (`Reservas.estado = 1`) y las entradas vendidas registradas en `DetallesFacturas` para esa función.

No utilizar `Butacas.reservada` como indicador global de disponibilidad: la misma butaca se reutiliza en distintas funciones. El diseño definitivo de la consulta y el mecanismo de bloqueo temporal todavía están pendientes de definición por backend.

La validación definitiva debe realizarse en el servidor al confirmar una reserva o compra, para evitar que dos clientes puedan adquirir la misma butaca por operaciones simultáneas.

### 4.4. Reserva y compra

El modelo contempla dos modalidades:

**Reserva:**

- Se registra una reserva.
- Sus entradas se almacenan en `DetallesReservas`.
- La reserva pertenece a un cliente.
- Puede tener una fecha de confirmación.

**Compra directa:**

- Se genera una factura sin necesidad de una reserva previa.
- `Facturas.idReserva` puede ser `NULL`.
- Las entradas se registran en `DetallesFacturas`.
- `DetallesFacturas.idDetalleReserva` puede ser `NULL`.

**Compra de una reserva:**

- Una factura puede asociarse a una reserva existente.
- Los detalles de la factura pueden referenciar los detalles de esa reserva.

El flujo exacto de confirmación, vencimiento y cancelación debe acordarse con backend.

### 4.5. Promociones y precios

Los importes se almacenan como `decimal(10,2)`.

Para los detalles de reservas, el precio se encuentra en `DetallesReservas.precio`.

Para los detalles de facturas, el precio base se encuentra en `DetallesFacturas.precioUnitario`.

El porcentaje de descuento se encuentra en `Promociones.porcentajeDescuento`.

El frontend debe mostrar el precio final que informe la API. El backend debe ser responsable de validar la promoción y calcular el importe definitivo.

### 4.6. Autenticación

La tabla `Clientes` contiene información de acceso.

El frontend debe enviar las credenciales al endpoint de autenticación definido por backend y manejar el resultado de forma segura.

Nunca debe acceder directamente a la base de datos ni almacenar contraseñas en texto plano en el navegador.

La autorización de administradores y clientes debe estar validada también en el backend. La protección de rutas de React es solamente una medida adicional de navegación.

---

## 5. Restricciones y aspectos que no están definidos en el script

El script define claves primarias, claves foráneas, tipos de datos y nulabilidad. Sin embargo, no define explícitamente varias reglas que el frontend podría necesitar.

No asumir que existen las siguientes restricciones:

- `dni` único.
- `email` único.
- Combinación de fila y número de butaca única dentro de una sala.
- Combinación de sala, fecha y horario única para una función.
- Porcentaje de descuento limitado entre 0 y 100.
- Fecha de inicio de una promoción anterior o igual a su fecha de finalización.
- Capacidad de sala igual a la cantidad de butacas registradas.
- Unicidad de las asociaciones de películas con géneros o actores.
- Unicidad de los días y horarios asociados a una promoción.

Estas reglas pueden estar implementadas en procedimientos, triggers, servicios o validaciones del backend, pero no se desprenden de las restricciones incluidas en este script.

También debe confirmarse:

- La unidad de `Peliculas.duracion`.
- El significado operativo de `Butacas.reservada` (no debe tratarse como disponibilidad global).
- El mecanismo de bloqueo temporal y validación concurrente de butacas.
- El tratamiento de reservas vencidas y su relación con `Reservas.estado`.
- La incorporación de `Peliculas.Activa` al esquema o la alternativa que defina backend.
- El formato y origen de las imágenes de póster.

Ya están confirmados por backend: el significado de `Reservas.estado` (`0` cancelada, `1` no cancelada; nuevas reservas con `true`) y que el formato 2D/3D corresponde a `Salas`.

---

## 6. Objetos de base de datos adicionales

Este documento describe las 24 tablas del script compartido.

No se documentan vistas, procedimientos almacenados, funciones o triggers porque no están incluidos en este script de creación de tablas.

Si el backend utiliza esos objetos para consultas o reglas de negocio, deben agregarse a esta sección cuando se comparta su definición.

---

## 7. Instrucciones para agentes de IA

Al trabajar en el frontend:

1. Utilizar los nombres de tablas y campos de este documento como referencia del modelo de datos.
2. No crear propiedades, columnas o relaciones que no estén documentadas.
3. No asumir que los nombres de las propiedades JSON de la API coinciden con los nombres SQL. El backend puede utilizar DTOs con nombres diferentes.
4. No inventar endpoints, parámetros, respuestas ni códigos de estado HTTP.
5. No conectar React directamente con SQL Server.
6. Obtener datos y realizar operaciones exclusivamente mediante los servicios de API.
7. Mantener separados los datos mock y las llamadas reales a la API.
8. No considerar una reserva o compra exitosa hasta recibir la confirmación del backend.
9. Respetar las reglas de autorización y validación del servidor.
10. Si una funcionalidad requiere un dato que no aparece en este documento, señalarlo como pendiente de confirmación en lugar de inventarlo.

**Prioridad:** el contrato de la API y las reglas confirmadas por el equipo backend determinan cómo debe comunicarse el frontend con el sistema. Este documento describe el modelo SQL, no reemplaza el contrato HTTP.
