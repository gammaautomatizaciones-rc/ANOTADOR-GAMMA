# CLAUDE.md — ANOTADOR GAMMA

> App web estática de gestión de tareas por categorías, con dashboard de estadísticas.
> Leeme ANTES de tocar código. Este archivo es el índice: dice qué leer según qué toques.

## Qué es

Anotador de tareas con:
- Categorías configurables (crear, renombrar, eliminar).
- Tareas con 3 estados: Pendiente → En Progreso → Completada.
- Búsqueda por texto y filtro por estado.
- Dashboard en pestaña aparte: anillo de completitud, KPI tiles, balance por categoría, lectura automática del tablero y heatmap de 7 días.
- Import/export JSON. Persistencia en `localStorage` (clave `AG_tasks`).

## Stack

- **HTML** estático con partials cargados por `fetch` (`partials/*.html`).
- **CSS** modular, 10 archivos en `css/`. Sin framework, sin build.
- **JS** vanilla ES2020, 9 módulos clásicos (NO ES modules) en `js/`.
- **Icons**: SVG inline propios en `js/icons.js` (Lucide-style, `stroke: currentColor`).
- **Deploy**: GitHub Pages (`main` / `/`).

## Fuente de verdad

| Dato | Dónde |
|---|---|
| Credenciales / tokens | `CREDENCIALES.md` (NO versionado) |
| Estado del proyecto, qué falta | `HILO_CONVERSACION.md` |
| Pendientes sueltos | `ANOTACIONES.md` |
| Patrones que rompen cosas | `REGLAS_DESARROLLO.md` |
| Estructura de archivos | `TREE.md` (auto-generado) |
| Buenas prácticas de animación | `GUIA_ANIMACIONES_ESTILOS.md` (índice) → `detalles/` |

## Qué leer según qué toques

| Vas a tocar... | Leé |
|---|---|
| Estilos, colores, animaciones | `REGLAS_DESARROLLO.md` §1-§4 + `GUIA_ANIMACIONES_ESTILOS.md` → `detalles/` |
| Lógica de tareas / estados | `js/tasks.js` + `REGLAS_DESARROLLO.md` §5 |
| Categorías / sidebar | `js/categories.js` + `js/render.js` |
| Dashboard / estadísticas | `js/stats.js` + `css/stats.css` + `css/insights.css` |
| Un partial o el layout | `partials/` + `REGLAS_DESARROLLO.md` §2 |
| Un ícono nuevo | `js/icons.js` (`ICON_PATHS` + `icon()`) |
| Deploy / GitHub | `REGLAS_DESARROLLO.md` §8-§9 |

## Estructura de la app

```
index.html          shell: linkea CSS, carga partials, incluye los 11 scripts
partials/           header.html · sidebar.html · main.html
css/                base · sidebar · main · category · tasks · stats · insights · tabs · layout · animations · loader · loader-anim
js/                 icons · loader · storage · render · tasks · categories · io · stats · stats-view · app · partials
```

**Flujo de arranque**: `js/partials.js` inicia el loader → hace `fetch` de los 3 partials → los inyecta → llama `initApp()` (en `js/app.js`) → espera `document.fonts.ready` → cierra el loader.

**Métricas vs vista**: `js/stats.js` calcula (métricas + insights), `js/stats-view.js` dibuja. Si `stats.js` crece, partir de ahí: el que dibuja va a `stats-view.js`.

## Reglas del proyecto (duras)

1. **Ningún archivo puede pasar de 150 líneas.** Si hace falta más detalle, va a `detalles/` — y ese archivo tampoco puede pasar de 150.
2. **Cero emojis.** Todo ícono es SVG de `js/icons.js`.
3. **No animar contenedores que se re-renderizan.** `renderMain`/`renderStats` recrean todo el `innerHTML`: si el contenedor base tiene `animation`, se repite en cada acción. Solo se animan eventos reales (`.adding`, `.removing`, `.status-change`).
4. **Un ícono = un path en `ICON_PATHS`.** No escribir SVG a mano en el HTML.
5. **Al cambiar la estructura, regenerar el TREE**: `python C:/Users/Gaston/.claude/hooks/generate-tree.py "C:/Users/Gaston/Desktop/GAMMA/PROYECTOS/ANOTADOR GAMMA"`.
6. **Antes de cada commit**: grep de secrets + `.gitignore` cubriendo `.env`, `CREDENCIALES.md`, `*_key.md`.

## Cómo probar

- **Local**: `python -m http.server 5500` en la carpeta del proyecto → `http://127.0.0.1:5500`. (O Live Server.)
- **Online**: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/
- **Deep-link**: `index.html#stats` abre directo en la pestaña de Estadísticas.
- **Test headless del DOM**: `node` con mock de `document`/`localStorage` (patrón usado en la sesión del 21/10/2026, 22 checks). El mock necesita `global.location = { hash: '' }` (la app lee `location.hash`).
- **Screenshot headless**: `chrome --headless=new --user-data-dir=<perfil> --screenshot=out.png --virtual-time-budget=5000 <url>`. Con un `--user-data-dir` fijo, se puede setear `localStorage` desde una página semilla y después capturar `index.html#stats`.
- **Syntax**: `node --check js/*.js` (todos los módulos).
