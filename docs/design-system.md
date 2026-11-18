# Design System — Cine2026

## 1. Objetivo visual

Construir una interfaz moderna, equilibrada y responsive para un sistema de gestión y venta de entradas de cine.

La identidad debe comunicar claramente que se trata de la web de un cine, no de una plataforma de streaming.

La experiencia debe priorizar:

- Consulta de cartelera y películas.
- Visualización de funciones disponibles.
- Compra y reserva de entradas.
- Gestión administrativa clara y funcional.

**Concepto:** cine contemporáneo, con una interfaz oscura, limpia y una identidad cinematográfica reconocible.

## 2. Paleta de colores

### Colores principales

| Token               | Valor     | Uso                              |
| ------------------- | --------- | -------------------------------- |
| `background`        | `#111315` | Fondo general                    |
| `surface`           | `#1C2024` | Tarjetas, paneles y contenedores |
| `surface-secondary` | `#292E33` | Elementos secundarios y hover    |
| `primary`           | `#D83A3A` | Acciones principales y acentos   |
| `primary-hover`     | `#B92D2D` | Hover de acciones principales    |
| `text-primary`      | `#F4F1ED` | Texto principal                  |
| `text-secondary`    | `#92999F` | Texto secundario                 |
| `border`            | `#343A40` | Bordes y separadores             |

### Colores semánticos

| Token     | Valor     | Uso                             |
| --------- | --------- | ------------------------------- |
| `success` | `#3B9B70` | Operaciones exitosas            |
| `warning` | `#D9A441` | Advertencias                    |
| `danger`  | `#D83A3A` | Errores y acciones destructivas |
| `info`    | `#4D91C7` | Información general             |

### Reglas de utilización

- El fondo general debe ser oscuro.
- Las superficies deben diferenciarse del fondo sin generar contrastes excesivos.
- El rojo es el color de acento principal, no un color para utilizar indiscriminadamente.
- Los botones principales y acciones importantes pueden utilizar el rojo.
- Los estados deben utilizar colores semánticos de manera consistente.
- Los textos secundarios nunca deben competir visualmente con los títulos y contenidos principales.

## 3. Tipografía

Utilizar una familia sans-serif moderna y legible.

Preferencia: Inter. Si no se encuentra disponible, utilizar una fuente sans-serif del sistema.

Jerarquía orientativa:

| Elemento                   | Tamaño   |
| -------------------------- | -------- |
| Título principal de página | 28–32 px |
| Título de sección          | 20–24 px |
| Subtítulo                  | 16–18 px |
| Texto general              | 14–16 px |
| Texto auxiliar             | 12–13 px |

Los títulos deben tener suficiente jerarquía, evitando tamaños excesivos.

## 4. Espaciado y dimensiones

Utilizar una escala consistente basada en múltiplos de 4 px.

Valores recomendados:

- 4 px: separación mínima.
- 8 px: separación entre elementos relacionados.
- 12 px: separación interna pequeña.
- 16 px: espaciado estándar.
- 24 px: separación entre componentes.
- 32 px: separación entre secciones.
- 48 px: separación entre bloques principales.

## 5. Bordes y elevación

- Bordes redondeados moderados.
- Inputs y botones: 6–8 px.
- Tarjetas: 10–12 px.
- Modales y paneles destacados: 12–16 px.
- Bordes sutiles con el color `border`.
- Sombras discretas para diferenciar niveles de contenido.

Evitar interfaces excesivamente redondeadas o con apariencia de aplicación móvil genérica.

## 6. Componentes reutilizables

Los componentes deben mantener una apariencia uniforme en toda la aplicación.

### Botones

Variantes:

- Primary: fondo rojo, texto claro.
- Secondary: fondo de superficie secundaria.
- Outline: transparente, con borde visible.
- Danger: reservado para acciones destructivas.

Estados:

- Normal.
- Hover.
- Focus.
- Disabled.
- Loading cuando corresponda.

### Inputs y formularios

- Fondo oscuro diferenciado del contenedor.
- Bordes sutiles.
- Labels visibles.
- Placeholder con menor contraste.
- Focus claramente identificable.
- Mensajes de validación debajo del campo.

### Tarjetas

- Fondo `surface`.
- Borde sutil.
- Espaciado interno consistente.
- Hover discreto cuando sean interactivas.

### Badges

Utilizar para estados, formatos y categorías.

Ejemplos:

- 2D / 3D.
- Disponible / Agotado.
- Confirmada / Pendiente / Cancelada.
- Idioma o subtítulos.

### Tablas

- Encabezados diferenciados.
- Filas con separación visual.
- Hover sutil.
- Estados vacíos y de carga contemplados.
- Diseño adaptable a pantallas pequeñas.

### Modales

- Fondo oscuro.
- Overlay para separar el contenido del resto de la interfaz.
- Acciones claramente diferenciadas.
- Cierre accesible.

## 7. Identidad cinematográfica

Los elementos visuales deben reforzar la identidad de cine sin recargar la interfaz.

### Cartelera

- Los posters son el elemento visual protagonista.
- Mantener su proporción original.
- Evitar recortes que oculten información importante.
- Mostrar título, género, duración y clasificación cuando corresponda.
- Incorporar acciones para consultar detalles y funciones.

### Funciones

- Los horarios deben tener buena visibilidad.
- Diferenciar formato 2D/3D e idioma.
- Mostrar información de sala cuando esté disponible.
- Los horarios seleccionables deben tener estados hover, seleccionado y deshabilitado.

### Selección de butacas

- Representación visual clara de la sala.
- Diferenciar butacas disponibles, seleccionadas y ocupadas.
- Incluir una leyenda.
- Mantener una disposición fácil de comprender.

### Recursos gráficos

Se pueden utilizar detalles inspirados en:

- Entradas de cine.
- Marquesinas.
- Cartelería.
- Salas y pantallas.

Estos recursos deben ser sutiles y no competir con la información funcional.

## 8. Iconografía

Utilizar Lucide React.

- Mantener un tamaño consistente.
- Utilizar iconos junto a textos cuando mejoren la comprensión.
- Evitar mezclar bibliotecas de iconos.
- No utilizar emojis como sustitutos de iconos de interfaz.

## 9. Layouts

### Área pública

- Navegación superior clara.
- Acceso visible a cartelera y cuenta.
- Presentación destacada de películas.
- Catálogo organizado.
- Footer con información del cine.

### Área de cliente

- Navegación consistente.
- Acceso a reservas y compras.
- Formularios y procesos de compra claros.
- Información importante fácilmente identificable.

### Área administrativa

- Sidebar o navegación lateral.
- Encabezado de página.
- Contenido organizado por secciones.
- Tarjetas de estadísticas.
- Tablas, filtros y formularios.
- Priorizar claridad y eficiencia por encima de los elementos decorativos.

## 10. Responsive design

La interfaz debe adaptarse a:

- Desktop.
- Tablet.
- Mobile.

Criterios:

- Navegación adaptable.
- Grillas de películas con columnas variables.
- Formularios utilizables en pantallas pequeñas.
- Tablas con alternativas de visualización cuando sea necesario.
- Botones y controles con áreas de interacción cómodas.

## 11. Accesibilidad y consistencia

- Mantener contraste suficiente entre texto y fondo.
- No comunicar estados únicamente mediante colores.
- Utilizar etiquetas asociadas a los campos.
- Mantener indicadores de foco visibles.
- Utilizar elementos semánticos.
- Mantener consistencia entre todas las áreas de la aplicación.

## 12. Reglas generales

1. Todos los componentes deben respetar esta identidad visual.
2. Evitar estilos individuales improvisados cuando exista un componente reutilizable.
3. No duplicar componentes que resuelvan la misma necesidad.
4. Mantener separados los componentes visuales de la lógica de negocio.
5. Priorizar interfaces limpias y fáciles de utilizar.
6. No introducir dependencias adicionales sin necesidad.
7. Utilizar Tailwind CSS 4 para los estilos.
8. Centralizar los tokens y estilos globales para facilitar modificaciones futuras.
