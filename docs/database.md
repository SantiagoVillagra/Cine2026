# Base de datos – Cine 2026

## 1. Información general

- **Base de datos:** `cine_proyecto`
- **Motor:** Microsoft SQL Server
- **Cantidad de tablas:** 25
- **Cantidad de vistas:** 6
- **Cantidad de funciones:** 3
- **Cantidad de procedimientos almacenados:** 4

Este documento describe el esquema definido en el script SQL final `ScriptCine2026Final.sql`.

La base de datos contempla:

- Gestión de clientes y autenticación.
- Catálogo de películas, géneros, actores, directores y clasificaciones.
- Salas, butacas y tipos de sala.
- Programación de funciones.
- Tipos de entrada y promociones.
- Reservas de entradas.
- Ocupación de butacas por función.
- Facturación y ventas.

**Fuente de verdad:** el script SQL final. Los nombres de tablas, columnas, tipos de datos, nulabilidad y relaciones deben respetar ese esquema. Las reglas de negocio adicionales deben confirmarse en el backend.

---

## 2. Tablas y columnas

Todas las claves primarias de las tablas con identificadores `IDENTITY` utilizan `int IDENTITY(1,1)`, salvo `OcupacionesButacas`, cuya clave primaria es compuesta.

### 2.1. Clientes

Almacena los usuarios registrados.

| Columna    | Tipo                 | Nulable |
| ---------- | -------------------- | ------- |
| idCliente  | int IDENTITY(1,1) PK | No      |
| nombre     | varchar(100)         | No      |
| apellido   | varchar(100)         | No      |
| dni        | varchar(20)          | No      |
| email      | varchar(150)         | No      |
| telefono   | varchar(30)          | Sí      |
| contraseña | varchar(255)         | No      |
| esAdmin    | bit                  | Sí      |

`esAdmin` permite distinguir usuarios administradores. La columna `contraseña` almacena la credencial del usuario; el tratamiento de contraseñas debe resolverse en el backend.

### 2.2. CanalesVenta

Canales mediante los cuales se registran las ventas.

| Columna      | Tipo                 | Nulable |
| ------------ | -------------------- | ------- |
| idCanalVenta | int IDENTITY(1,1) PK | No      |
| descripcion  | varchar(50)          | No      |

### 2.3. FormasPago

Medios de pago disponibles.

| Columna     | Tipo                 | Nulable |
| ----------- | -------------------- | ------- |
| idFormaPago | int IDENTITY(1,1) PK | No      |
| descripcion | varchar(50)          | No      |

### 2.4. HorasFuncion

Horarios predefinidos para las funciones.

| Columna       | Tipo                 | Nulable |
| ------------- | -------------------- | ------- |
| idHoraFuncion | int IDENTITY(1,1) PK | No      |
| horaFuncion   | time(7)              | No      |

### 2.5. Promociones

Promociones y descuentos disponibles.

| Columna             | Tipo                 | Nulable |
| ------------------- | -------------------- | ------- |
| idPromocion         | int IDENTITY(1,1) PK | No      |
| descripcion         | varchar(200)         | No      |
| porcentajeDescuento | decimal(5,2)         | No      |
| fechaDesde          | date                 | No      |
| fechaHasta          | date                 | No      |

### 2.6. PromocionesDias

Días de la semana en los que se aplica una promoción.

| Columna        | Tipo                 | Nulable |
| -------------- | -------------------- | ------- |
| idPromocionDia | int IDENTITY(1,1) PK | No      |
| diaSemana      | varchar(20)          | No      |
| idPromocion    | int FK               | No      |

### 2.7. PromocionesHorarios

Horarios asociados a las promociones.

| Columna            | Tipo                 | Nulable |
| ------------------ | -------------------- | ------- |
| idPromocionHorario | int IDENTITY(1,1) PK | No      |
| idHoraFuncion      | int FK               | No      |
| idPromocion        | int FK               | No      |

### 2.8. TiposEntrada

Categorías de entradas disponibles.

| Columna       | Tipo                 | Nulable |
| ------------- | -------------------- | ------- |
| idTipoEntrada | int IDENTITY(1,1) PK | No      |
| descripcion   | varchar(50)          | No      |

### 2.9. TiposSala

Tipos de sala y su precio asociado.

| Columna     | Tipo                 | Nulable |
| ----------- | -------------------- | ------- |
| idTipoSala  | int IDENTITY(1,1) PK | No      |
| descripcion | varchar(50)          | No      |
| precio      | decimal(10,2)        | No      |

### 2.10. Salas

Salas físicas del cine.

| Columna    | Tipo                 | Nulable |
| ---------- | -------------------- | ------- |
| idSala     | int IDENTITY(1,1) PK | No      |
| numeroSala | int                  | No      |
| capacidad  | int                  | No      |
| idTipoSala | int FK               | No      |

El tipo de sala se obtiene mediante `idTipoSala`.

### 2.11. Butacas

Butacas pertenecientes a una sala.

| Columna   | Tipo                 | Nulable |
| --------- | -------------------- | ------- |
| idButaca  | int IDENTITY(1,1) PK | No      |
| fila      | varchar(10)          | No      |
| numero    | int                  | No      |
| idSala    | int FK               | No      |
| reservada | bit                  | Sí      |

La relación con una función no se almacena directamente en esta tabla. La disponibilidad se determina mediante `OcupacionesButacas`, utilizando la combinación de `idFuncion` e `idButaca`.

No debe utilizarse `reservada` como indicador global de disponibilidad: una misma butaca puede estar ocupada para una función y libre para otra.

### 2.12. Idiomas

Idiomas disponibles para las funciones.

| Columna     | Tipo                 | Nulable |
| ----------- | -------------------- | ------- |
| idIdioma    | int IDENTITY(1,1) PK | No      |
| descripcion | varchar(50)          | No      |

### 2.13. Clasificaciones

Clasificaciones de edad de las películas.

| Columna         | Tipo                 | Nulable |
| --------------- | -------------------- | ------- |
| idClasificacion | int IDENTITY(1,1) PK | No      |
| descripcion     | varchar(20)          | No      |

### 2.14. Directores

Directores de películas.

| Columna    | Tipo                 | Nulable |
| ---------- | -------------------- | ------- |
| idDirector | int IDENTITY(1,1) PK | No      |
| nombre     | varchar(100)         | No      |

### 2.15. Generos

Géneros cinematográficos.

| Columna  | Tipo                 | Nulable |
| -------- | -------------------- | ------- |
| idGenero | int IDENTITY(1,1) PK | No      |
| nombre   | varchar(50)          | No      |

### 2.16. Actores

Actores que participan en películas.

| Columna | Tipo                 | Nulable |
| ------- | -------------------- | ------- |
| idActor | int IDENTITY(1,1) PK | No      |
| nombre  | varchar(100)         | No      |

### 2.17. Peliculas

Información del catálogo de películas.

| Columna         | Tipo                 | Nulable |
| --------------- | -------------------- | ------- |
| idPelicula      | int IDENTITY(1,1) PK | No      |
| titulo          | varchar(200)         | No      |
| duracion        | int                  | No      |
| idClasificacion | int FK               | No      |
| idDirector      | int FK               | No      |
| fechaEstreno    | date                 | No      |
| poster          | varchar(300)         | Sí      |
| sinopsis        | varchar(max)         | Sí      |
| activa          | bit                  | Sí      |

La duración se expresa en minutos según las validaciones del backend.

`activa` permite indicar si una película se encuentra disponible para la programación. Aunque el backend crea las películas como activas, la columna admite `NULL` en el esquema SQL.

`poster` almacena una referencia o ruta del póster.

### 2.18. PeliculasGeneros

Tabla intermedia para la relación muchos a muchos entre películas y géneros.

| Columna          | Tipo                 | Nulable |
| ---------------- | -------------------- | ------- |
| idPeliculaGenero | int IDENTITY(1,1) PK | No      |
| idPelicula       | int FK               | No      |
| idGenero         | int FK               | No      |

### 2.19. ActoresPeliculas

Tabla intermedia para la relación muchos a muchos entre actores y películas.

| Columna         | Tipo                 | Nulable |
| --------------- | -------------------- | ------- |
| idActorPelicula | int IDENTITY(1,1) PK | No      |
| idActor         | int FK               | No      |
| idPelicula      | int FK               | No      |

### 2.20. Funciones

Funciones programadas del cine.

| Columna       | Tipo                 | Nulable |
| ------------- | -------------------- | ------- |
| idFuncion     | int IDENTITY(1,1) PK | No      |
| fecha         | date                 | No      |
| idHoraFuncion | int FK               | No      |
| subtitulada   | bit                  | No      |
| idPelicula    | int FK               | No      |
| idSala        | int FK               | No      |
| idIdioma      | int FK               | No      |

La duración de la función se obtiene de la película asociada. El horario se obtiene de `HorasFuncion`.

### 2.21. Reservas

Reservas realizadas por los clientes.

| Columna               | Tipo                 | Nulable |
| --------------------- | -------------------- | ------- |
| idReserva             | int IDENTITY(1,1) PK | No      |
| fechaHoraReserva      | datetime             | No      |
| idCliente             | int FK               | No      |
| estado                | bit                  | No      |
| fechaHoraConfirmacion | datetime             | Sí      |

El esquema define `estado` como un booleano. La interpretación concreta de sus valores y las reglas de cancelación, confirmación o expiración deben respetar la lógica implementada por el backend.

### 2.22. DetallesReservas

Entradas individuales asociadas a una reserva.

| Columna          | Tipo                 | Nulable |
| ---------------- | -------------------- | ------- |
| idDetalleReserva | int IDENTITY(1,1) PK | No      |
| idReserva        | int FK               | No      |
| idFuncion        | int FK               | No      |
| idButaca         | int FK               | No      |
| idTipoEntrada    | int FK               | No      |
| precio           | decimal(10,2)        | No      |
| idPromocion      | int FK               | Sí      |

Cada registro representa una entrada reservada para una función y una butaca determinadas.

### 2.23. Facturas

Comprobantes de ventas realizadas.

| Columna          | Tipo                 | Nulable |
| ---------------- | -------------------- | ------- |
| idFactura        | int IDENTITY(1,1) PK | No      |
| fechaHoraEmision | datetime             | No      |
| idReserva        | int FK               | Sí      |
| idCliente        | int FK               | No      |
| idFormaPago      | int FK               | No      |
| idCanalVenta     | int FK               | No      |

`idReserva` admite `NULL`, por lo que una factura puede corresponder a una venta directa que no proviene de una reserva.

### 2.24. DetallesFacturas

Entradas individuales incluidas en una factura.

| Columna          | Tipo                 | Nulable |
| ---------------- | -------------------- | ------- |
| idDetalleFactura | int IDENTITY(1,1) PK | No      |
| precioUnitario   | decimal(10,2)        | No      |
| idFactura        | int FK               | No      |
| idFuncion        | int FK               | No      |
| idPromocion      | int FK               | Sí      |
| idButaca         | int FK               | No      |
| idDetalleReserva | int FK               | Sí      |
| idTipoEntrada    | int FK               | No      |

`precioUnitario` almacena el precio base de la entrada. Cuando existe una promoción, el descuento se determina mediante `idPromocion` y el porcentaje correspondiente.

`idDetalleReserva` admite `NULL` para permitir ventas directas que no provienen de una reserva.

### 2.25. OcupacionesButacas

Registra la ocupación de cada butaca para una función determinada.

| Columna          | Tipo                 | Nulable |
| ---------------- | -------------------- | ------- |
| idFuncion        | int FK, PK compuesta | No      |
| idButaca         | int FK, PK compuesta | No      |
| idDetalleReserva | int FK               | Sí      |
| idDetalleFactura | int FK               | Sí      |

La clave primaria está compuesta por:

`(idFuncion, idButaca)`

Esto impide registrar más de una ocupación para la misma butaca en una misma función.

Los vínculos con los detalles de reserva y factura permiten relacionar la ocupación con el origen de la operación.

La tabla es el mecanismo que permite consultar disponibilidad por función. No se debe asumir que `Butacas.reservada` representa el estado actual de todas las funciones.

---

## 3. Relaciones entre tablas

Las relaciones se definen mediante claves foráneas en el script SQL.

### 3.1. Películas y catálogo

- `Peliculas.idClasificacion` → `Clasificaciones.idClasificacion`
- `Peliculas.idDirector` → `Directores.idDirector`
- `PeliculasGeneros.idPelicula` → `Peliculas.idPelicula`
- `PeliculasGeneros.idGenero` → `Generos.idGenero`
- `ActoresPeliculas.idActor` → `Actores.idActor`
- `ActoresPeliculas.idPelicula` → `Peliculas.idPelicula`

Una película puede tener varios géneros y varios actores. Un género o actor puede estar asociado a varias películas.

### 3.2. Salas y funciones

- `Salas.idTipoSala` → `TiposSala.idTipoSala`
- `Butacas.idSala` → `Salas.idSala`
- `Funciones.idPelicula` → `Peliculas.idPelicula`
- `Funciones.idSala` → `Salas.idSala`
- `Funciones.idIdioma` → `Idiomas.idIdioma`
- `Funciones.idHoraFuncion` → `HorasFuncion.idHoraFuncion`

Una sala contiene varias butacas y puede tener distintas funciones programadas.

### 3.3. Promociones

- `PromocionesDias.idPromocion` → `Promociones.idPromocion`
- `PromocionesHorarios.idPromocion` → `Promociones.idPromocion`
- `PromocionesHorarios.idHoraFuncion` → `HorasFuncion.idHoraFuncion`

Las promociones pueden estar condicionadas por fechas, días de la semana y horarios.

### 3.4. Reservas

- `Reservas.idCliente` → `Clientes.idCliente`
- `DetallesReservas.idReserva` → `Reservas.idReserva`
- `DetallesReservas.idFuncion` → `Funciones.idFuncion`
- `DetallesReservas.idButaca` → `Butacas.idButaca`
- `DetallesReservas.idTipoEntrada` → `TiposEntrada.idTipoEntrada`
- `DetallesReservas.idPromocion` → `Promociones.idPromocion`

Una reserva puede contener varios detalles, cada uno asociado a una función, butaca y tipo de entrada.

### 3.5. Facturación

- `Facturas.idCliente` → `Clientes.idCliente`
- `Facturas.idFormaPago` → `FormasPago.idFormaPago`
- `Facturas.idCanalVenta` → `CanalesVenta.idCanalVenta`
- `Facturas.idReserva` → `Reservas.idReserva`
- `DetallesFacturas.idFactura` → `Facturas.idFactura`
- `DetallesFacturas.idFuncion` → `Funciones.idFuncion`
- `DetallesFacturas.idButaca` → `Butacas.idButaca`
- `DetallesFacturas.idTipoEntrada` → `TiposEntrada.idTipoEntrada`
- `DetallesFacturas.idPromocion` → `Promociones.idPromocion`
- `DetallesFacturas.idDetalleReserva` → `DetallesReservas.idDetalleReserva`

Una factura contiene uno o varios detalles de factura.

### 3.6. Ocupación de butacas

- `OcupacionesButacas.idFuncion` → `Funciones.idFuncion`
- `OcupacionesButacas.idButaca` → `Butacas.idButaca`
- `OcupacionesButacas.idDetalleReserva` → `DetallesReservas.idDetalleReserva`
- `OcupacionesButacas.idDetalleFactura` → `DetallesFacturas.idDetalleFactura`

La clave primaria compuesta `(idFuncion, idButaca)` identifica una ocupación única por función y butaca.

---

## 4. Vistas

El script SQL crea las siguientes vistas:

| Vista                                  | Propósito                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `vw_AnalisisVentasGeneroClasificacion` | Analiza entradas vendidas, ventas con y sin promoción e ingresos agrupados por género y clasificación. |
| `VentasPeliculaSala`                   | Relaciona películas, tipos de sala, detalles de factura e importes considerando descuentos.            |
| `vw_RendimientoSalas`                  | Resume funciones y entradas vendidas por sala, año y mes.                                              |
| `vw_AnalisisComprasClientes`           | Resume compras por cliente: facturas, entradas, funciones, películas e importe total con descuentos.   |
| `vw_EntradasFuncion`                   | Calcula la cantidad de entradas vendidas por función.                                                  |
| `vw_UsoButacasSalas`                   | Resume reservas y ventas asociadas a las butacas de cada sala.                                         |

Estas vistas centralizan consultas de análisis y evitan repetir las mismas operaciones de agrupación y relación entre tablas.

---

## 5. Funciones definidas por el usuario

| Función                                  | Parámetros                                                            | Retorno        | Propósito                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------- |
| `fn_Ocupacion`                           | `@entradas INT`, `@capacidad INT`                                     | `DECIMAL(5,2)` | Calcula el porcentaje de ocupación de una sala o función.                               |
| `fn_TipoVenta`                           | `@idPromocion INT`                                                    | `VARCHAR(20)`  | Devuelve si una venta se realizó con o sin promoción.                                   |
| `fn_RecaudacionMensualPeliculasFiltrada` | Fecha inicial, fecha final, género opcional e importe mínimo opcional | Tabla          | Obtiene entradas vendidas y recaudación por película y período, con filtros opcionales. |

### Consideraciones

- `fn_Ocupacion` utiliza `NULLIF` para evitar una división por cero.
- `fn_TipoVenta` considera que un `idPromocion` nulo representa una venta sin promoción.
- `fn_RecaudacionMensualPeliculasFiltrada` devuelve una tabla con información de recaudación y permite filtrar por género e importe mínimo.

---

## 6. Procedimientos almacenados

| Procedimiento                        | Parámetros                                        | Propósito                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `pa_AnalizarComprasClientes`         | `@cantidadPeliculas INT`, `@cantidadEntradas INT` | Identifica clientes que cumplen mínimos de películas y entradas compradas y superan el promedio de importe total.                            |
| `pa_CompararGenerosPorClasificacion` | Sin parámetros                                    | Compara ventas e ingresos por género y clasificación, incluyendo el promedio y la comparación respecto de ese promedio.                      |
| `pa_OcupacionFuncion`                | `@idFuncion INT`                                  | Devuelve información de ocupación de una función, incluyendo película, entradas vendidas, capacidad y porcentaje de ocupación.               |
| `sp_RendimientoSalas`                | `@mes INT`, `@anio INT`                           | Consulta el rendimiento de salas para un mes y año determinados, incluyendo funciones, entradas vendidas y promedio de entradas por función. |

---

## 7. Consideraciones para el desarrollo

1. La disponibilidad de butacas se consulta por la combinación `idFuncion` + `idButaca`, utilizando `OcupacionesButacas`.
2. No utilizar `Butacas.reservada` como indicador global de disponibilidad.
3. `Facturas.idReserva` puede ser nulo cuando la venta no proviene de una reserva.
4. `DetallesFacturas.idDetalleReserva` puede ser nulo cuando la entrada se vende directamente.
5. `DetallesFacturas.precioUnitario` representa el precio base; el descuento se calcula mediante la promoción asociada.
6. `DetallesReservas.precio` almacena el precio correspondiente al detalle de reserva.
7. `Peliculas.activa` admite valores nulos en la base de datos, aunque el backend contempla crear películas activas.
8. `Reservas.estado` es de tipo `bit`. No se deben inventar estados adicionales sin modificar y confirmar el modelo.
9. Las relaciones entre películas y géneros, y entre actores y películas, se resuelven mediante tablas intermedias.
10. Los datos que determinan precios, promociones, disponibilidad y estados deben validarse en el backend.

---

## 8. Fuente de verdad y mantenimiento

El script `ScriptCine2026Final.sql` es la referencia para el esquema de la base de datos.

Ante cualquier cambio en tablas, columnas, claves o relaciones:

1. Actualizar el script SQL.
2. Actualizar las entidades y configuraciones de Entity Framework Core.
3. Verificar las consultas y servicios que utilizan las estructuras modificadas.
4. Actualizar este documento.
5. Revisar el contrato de la API si el cambio afecta los datos enviados o recibidos por el frontend.

No asumir que una propiedad de una entidad, un DTO o una pantalla existe en la base de datos si no está definida en el esquema o confirmada mediante una modificación posterior.
