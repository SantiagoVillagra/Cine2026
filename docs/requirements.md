# Requirements – Sistema de Gestión de Cine

## 1. Descripción general

Desarrollar una aplicación web SPA (Single Page Application) para un sistema de gestión de cine.

La aplicación permitirá a los visitantes consultar las películas disponibles en cartelera, conocer sus funciones y acceder a la compra o reserva de entradas.

También contará con dos áreas privadas:

- **Administración:** gestión de películas, funciones y visualización de estadísticas.
- **Clientes:** consulta de funciones, selección de butacas, compra de entradas y administración de reservas.

El frontend consumirá una API REST desarrollada con ASP.NET Core Web API. La persistencia de datos estará a cargo de SQL Server.

## 2. Tecnologías

### Frontend

- Vite.
- React.
- JavaScript (ES6+).
- Tailwind CSS.
- React Router.
- Axios.
- Recharts para gráficos y estadísticas.
- Lucide React para iconografía.

Se podrán incorporar otras librerías cuando exista una necesidad concreta.

### Backend

- ASP.NET Core Web API.
- SQL Server.
- API REST para la comunicación con el frontend.

El desarrollo del backend estará a cargo de otros integrantes del equipo.

## 3. Tipos de usuario

La aplicación contempla tres estados de acceso:

### 3.1. Visitante

Usuario que navega sin haber iniciado sesión.

Puede:

- Consultar la cartelera.
- Visualizar información de las películas.
- Consultar las funciones disponibles.
- Acceder al formulario de inicio de sesión.

No puede realizar reservas ni compras.

### 3.2. Cliente

Usuario autenticado con rol de cliente.

Puede:

- Consultar películas y funciones.
- Consultar disponibilidad de butacas.
- Seleccionar butacas para una función.
- Realizar reservas y compras.
- Confirmar una reserva mediante el pago correspondiente.
- Comprar entradas directamente, sin generar una reserva previa.
- Cancelar reservas, según las condiciones establecidas.
- Consultar sus reservas y compras.

### 3.3. Administrador

Usuario autenticado con rol de administrador.

Puede:

- Acceder al dashboard administrativo.
- Consultar estadísticas del cine.
- Crear, modificar y eliminar películas.
- Crear, modificar y eliminar funciones.
- Consultar información relevante para la gestión.

## 4. Estructura y navegación

La aplicación tendrá una navegación SPA mediante React Router.

Las rutas se organizarán en tres áreas:

### 4.1. Área pública

- `/` – Página principal.
- `/pelicula/:id` – Detalle de una película.
- `/login` – Inicio de sesión.

### 4.2. Área administrativa

- `/admin/dashboard` – Dashboard de estadísticas.
- `/admin/peliculas` – Listado y ABM de películas.
- `/admin/peliculas/nueva` – Alta de película.
- `/admin/funciones` – Listado y ABM de funciones.
- `/admin/funciones/nueva` – Alta de función.

### 4.3. Área de clientes

- `/cliente/reservas` – Reservas del cliente.
- `/cliente/reservar/:funcionId` – Selección de butacas y proceso de reserva o compra.
- `/cliente/mis-compras` – Historial de compras y entradas.

Las rutas privadas deberán verificar la autenticación y el rol del usuario.

El acceso a cada sección deberá estar restringido según los permisos correspondientes.

## 5. Funcionalidades públicas

### 5.1. Página principal

La página principal será la entrada al sistema y tendrá una estética relacionada con la temática cinematográfica.

Deberá incluir:

**Navbar**

- Logo y nombre del cine.
- Navegación hacia la página principal.
- Botón de inicio de sesión.
- Cuando exista una sesión activa, mostrar el acceso correspondiente al área del usuario y la opción de cerrar sesión.

**Carrusel de películas**

- Mostrar películas destacadas de la cartelera.
- Incluir imagen o póster, título y acceso al detalle.
- Permitir navegar entre las películas.

**Cartelera**

- Mostrar todas las películas actualmente disponibles.
- Cada película deberá representarse mediante una card.
- Las cards incluirán póster, título, clasificación y otra información relevante.
- Al seleccionar una película, navegar a su página de detalle.

**Filtros**

- Filtrar películas por formato de proyección (2D/3D).
- Filtrar películas por idioma.
- Permitir combinar filtros.
- Permitir restablecer los filtros.

**Footer**

- Tecnologías utilizadas.
- Información de los integrantes del equipo.
- Información adicional del proyecto.

### 5.2. Detalle de película

La página de detalle deberá mostrar:

- Póster de la película.
- Título.
- Sinopsis.
- Duración.
- Género.
- Clasificación.
- Idioma y otros datos relevantes.

También deberá mostrar las funciones disponibles para esa película.

Las funciones deberán permitir identificar:

- Fecha.
- Horario.
- Sala.
- Formato de proyección (2D/3D).
- Idioma.

Cada función deberá ofrecer acceso a la selección de butacas y posterior reserva o compra, previa autenticación.

Si el usuario no inició sesión, deberá solicitarse el acceso antes de continuar con la operación.

## 6. Autenticación

La aplicación deberá contar con un formulario de inicio de sesión.

El usuario ingresará sus credenciales y el frontend enviará la solicitud a la API.

Según el rol devuelto por el backend:

- Administrador: redirigir al dashboard administrativo.
- Cliente: redirigir al área de clientes.

Se deberá contemplar:

- Validación de campos.
- Mensajes de error ante credenciales incorrectas.
- Manejo de sesión.
- Cierre de sesión.
- Protección de rutas privadas.
- Persistencia de sesión según el mecanismo de autenticación acordado con el backend.

El frontend no deberá implementar por su cuenta mecanismos de autorización que correspondan al backend.

## 7. Panel de administración

### 7.1. Dashboard

El administrador tendrá acceso a un dashboard completo con estadísticas obtenidas de la API.

Deberá permitir visualizar información general del funcionamiento del cine y analizar los datos mediante indicadores, gráficos y tablas.

Se podrán mostrar indicadores como:

- Cantidad de películas en cartelera.
- Cantidad de funciones.
- Cantidad de entradas vendidas.
- Cantidad de reservas.
- Recaudación total.
- Películas con mayor cantidad de entradas vendidas.
- Funciones con mayor ocupación.
- Ocupación general de las salas.

**Visualización de estadísticas**

Los indicadores podrán presentarse mediante:

- Tarjetas de métricas.
- Gráficos de barras.
- Gráficos de líneas.
- Gráficos circulares.
- Tablas comparativas.

**Filtros y períodos**

El dashboard deberá contar con filtros que permitan analizar las estadísticas en distintos períodos.

Se contemplan:

- Día.
- Semana.
- Mes.
- Año.
- Rango de fechas personalizado, cuando los datos y endpoints lo permitan.

Los gráficos e indicadores deberán actualizarse según el período seleccionado.

Se deberá contemplar:

- Estados de carga.
- Ausencia de datos.
- Errores al consultar estadísticas.
- Actualización de información al modificar los filtros.

Los datos deberán obtenerse del backend, no calcularse a partir de información simulada en producción.

La disponibilidad exacta de indicadores y filtros dependerá de los endpoints proporcionados por el backend.

### 7.2. ABM de películas

El administrador podrá:

- Consultar el listado de películas.
- Registrar nuevas películas.
- Modificar películas existentes.
- Eliminar películas.

Los formularios deberán incluir los campos que correspondan al modelo de películas de la base de datos.

Se deberá contemplar:

- Validación de datos.
- Mensajes de confirmación.
- Mensajes de éxito y error.
- Actualización del listado después de las operaciones.

### 7.3. ABM de funciones

El administrador podrá:

- Consultar las funciones registradas.
- Crear nuevas funciones.
- Modificar funciones existentes.
- Eliminar funciones.

Los formularios deberán permitir seleccionar la película, sala, horario, idioma y formato de proyección, según los datos disponibles en el backend.

Se deberán contemplar las validaciones necesarias para evitar inconsistencias en la programación de funciones.

## 8. Panel de clientes

### 8.1. Consulta de funciones

El cliente podrá seleccionar una película y consultar sus funciones disponibles.

Al seleccionar una función, podrá iniciar el proceso de reserva o compra.

### 8.2. Selección de butacas

Se deberá desarrollar una interfaz visual que represente la distribución de butacas de la sala.

La interfaz deberá:

- Representar la ubicación de las butacas.
- Diferenciar butacas disponibles, ocupadas y seleccionadas.
- Permitir seleccionar y deseleccionar butacas disponibles.
- Mostrar la cantidad de butacas seleccionadas.
- Mostrar el precio correspondiente.
- Impedir la selección de butacas que no estén disponibles.

La disponibilidad deberá consultarse al backend.

Antes de confirmar una operación, el backend deberá validar nuevamente que las butacas continúen disponibles.

La interfaz deberá contemplar posibles cambios de disponibilidad mientras el cliente realiza la selección.

### 8.3. Reserva y compra de entradas

El cliente podrá seleccionar una o varias butacas para una función.

El sistema deberá ofrecer dos modalidades de operación:

**Modalidad A: Reserva con pago posterior**

- Seleccionar las butacas.
- Generar una reserva.
- Consultar el estado de la reserva.
- Acceder posteriormente a la reserva.
- Confirmar la reserva mediante el pago correspondiente.
- Cancelar la reserva cuando corresponda.

**Modalidad B: Compra directa**

- Seleccionar las butacas.
- Iniciar directamente el proceso de compra.
- Confirmar la compra mediante el mecanismo de pago definido.
- Obtener la confirmación de la operación.

Ambas modalidades deberán estar disponibles para el cliente.

El estado final de las operaciones deberá ser informado por el backend.

El frontend deberá mostrar mensajes claros para las operaciones exitosas y fallidas.

Las reglas de vencimiento, disponibilidad temporal de butacas y cancelación de reservas dependerán de las definiciones del backend.

### 8.4. Mis reservas y compras

El cliente podrá consultar sus operaciones.

Se deberá mostrar información como:

- Película.
- Función.
- Fecha y horario.
- Sala.
- Butacas.
- Importe.
- Estado de la reserva o compra.

También deberá poder acceder a las acciones permitidas para cada operación, como confirmar o cancelar una reserva.

## 9. Integración con el backend

Toda la comunicación con la base de datos se realizará exclusivamente mediante la API REST.

El frontend deberá:

- Centralizar las solicitudes HTTP.
- Separar los servicios de acceso a datos de los componentes visuales.
- Manejar estados de carga.
- Manejar errores de conexión y respuestas HTTP.
- Validar los datos recibidos antes de utilizarlos cuando sea necesario.
- Actualizar la interfaz después de operaciones exitosas.

No se deberán inventar endpoints ni estructuras de DTO.

La integración se realizará utilizando los contratos de API proporcionados por el equipo de backend.

Mientras la API no esté disponible, se podrán utilizar datos simulados (mock data), manteniendo separada la lógica de simulación de los componentes visuales.

## 10. Requisitos de interfaz y experiencia de usuario

### 10.1. Identidad visual

La aplicación tendrá una estética oscura, moderna y cinematográfica, inspirada en las plataformas de streaming y los sitios web de cine.

Se priorizará:

- Fondos oscuros.
- Contraste adecuado entre superficies y textos.
- Colores de acento para botones y acciones importantes.
- Pósters e imágenes cinematográficas como elementos visuales destacados.
- Tipografía moderna y legible.
- Jerarquía visual clara.

La identidad visual deberá mantenerse coherente en las áreas pública, administrativa y de clientes.

Los paneles privados podrán tener layouts diferenciados, pero deberán conservar el mismo sistema de diseño.

### 10.2. Experiencia de usuario

Se priorizará:

- Diseño moderno y atractivo.
- Interfaz intuitiva.
- Diseño responsive para escritorio, tablet y dispositivos móviles.
- Consistencia visual entre todas las secciones.
- Componentes reutilizables.
- Navegación clara.
- Formularios fáciles de utilizar.
- Indicadores visuales para estados de carga, éxito y error.
- Confirmaciones antes de operaciones importantes.

## 11. Requisitos técnicos y de calidad

- Utilizar JavaScript y React.
- Mantener una arquitectura modular.
- Separar componentes, páginas, servicios y lógica reutilizable.
- Evitar duplicación de código.
- Mantener una nomenclatura consistente.
- Utilizar variables de entorno para configuraciones como la URL de la API.
- No almacenar contraseñas ni información sensible en el frontend.
- Implementar protección de rutas según autenticación y roles.
- Mantener el código legible y mantenible.
- Verificar que el proyecto compile correctamente después de cada etapa.

## 12. Alcance y consideraciones pendientes

Algunas decisiones deberán definirse en conjunto con el equipo de backend:

- Mecanismo de autenticación y manejo de tokens.
- Contratos y endpoints definitivos de la API.
- Campos obligatorios para películas y funciones.
- Reglas de disponibilidad y bloqueo temporal de butacas.
- Tiempo de vigencia de las reservas pendientes.
- Condiciones para confirmar o cancelar reservas.
- Integración con el mecanismo de pago.
- Estadísticas disponibles para el dashboard.
- Filtros y períodos admitidos por los endpoints estadísticos.
- Tratamiento de operaciones simultáneas sobre las mismas butacas.

Hasta que estas definiciones estén disponibles, el frontend podrá desarrollarse utilizando datos simulados, sin asumir reglas de negocio que todavía no hayan sido acordadas.
