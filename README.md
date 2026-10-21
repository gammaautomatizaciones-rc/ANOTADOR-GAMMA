# Anotador de Tareas Profesionales

Anotador de tareas pendientes, subdividido por categorías, con dashboard de estadísticas y lectura automática del tablero.

## Funcionalidades

- Crear categorías personalizadas.
- Agregar tareas dentro de cada categoría (edición inline con doble clic).
- Estados: Pendiente, En Progreso, Completada, con animaciones al agregar/borrar.
- Búsqueda y filtro por estado.
- Dashboard: anillo de completitud, KPI tiles, balance por categoría, heatmap de 7 días.
- Lectura automática del tablero (detecta cuellos de botella, sobrecarga, duplicados, racha).
- Importar/exportar JSON (archivo o portapapeles).
- Persistencia en `localStorage` bajo la clave `AG_tasks`.

## Archivos de contexto

| Archivo | Qué es |
|---|---|
| `CLAUDE.md` | Índice del proyecto: qué leer según qué toques |
| `HILO_CONVERSACION.md` | Diario, "en qué quedamos" y decisiones clave |
| `ANOTACIONES.md` | Pendientes reales y notas de trabajo |
| `REGLAS_DESARROLLO.md` | Patrones que rompen cosas (leer antes de tocar código) |
| `CREDENCIALES.md` | Credenciales. **No se versiona** (está en `.gitignore`) |
| `TREE.md` | Estructura auto-generada |
| `GUIA_ANIMACIONES_ESTILOS.md` | Índice de la guía de animaciones (detalle en `detalles/`) |
| `detalles/` | Documentación larga, partida por la regla de 150 líneas |

> **Regla dura**: ningún archivo del proyecto puede pasar las 150 líneas.

## Estructura

```
index.html          shell: carga los partials y los CSS/JS
partials/
  header.html       encabezado + acciones globales
  sidebar.html      panel de categorías
  main.html         contenido principal, búsqueda, footer
css/
  base.css          variables, reset, header, footer
  sidebar.css       panel de categorías
  main.css          contenedor principal, búsqueda, estado vacío
  category.css      tarjeta de categoría y alta de tareas
  tasks.css         tarjetas de tarea y botones de estado
  stats.css         anillo de progreso y KPI tiles
  insights.css      balance por categoría, insights, heatmap
  tabs.css          pestañas, iconos SVG
  layout.css        workspace, responsive, scrollbar
  animations.css    keyframes
js/
  icons.js          set de iconos SVG inline
  storage.js        localStorage
  render.js         render de sidebar y contenido
  tasks.js          alta, estado, borrado, edición de tareas
  categories.js     alta, borrado, selección, filtros
  io.js             importar y exportar
  stats.js          métricas, insights, heatmap
  app.js            estado global, pestañas, init
  partials.js       carga los partials y arranca la app
```

## Pestañas

- **Tareas**: buscador, filtro, categorías y tareas.
- **Estadísticas**: anillo de completitud, KPI tiles, balance por categoría,
  lectura automática del tablero y heatmap de 7 días.

## Iconos

Set propio de SVG inline en `js/icons.js` (estilo Lucide, `stroke: currentColor`,
sin color propio). Para agregar uno: definí el path en `ICON_PATHS` y usá
`icon('nombre')` en templates JS o `<span data-icon="nombre">` en el HTML.

> Requiere servidor local (Live Server). Abrir `index.html` con doble clic no
> carga los partials porque `fetch` no funciona con `file://`.

## Cómo usar

1. Abrí `index.html` en el navegador.
2. Agregá una categoría en el panel izquierdo.
3. Dentro de una categoría, agregá tareas y cambiá su estado.
4. Mirá el dashboard arriba: completitud, balance e insights.
