# HILO DE CONVERSACIÓN — ANOTADOR GAMMA

## Diario (1 línea por sesión)

- **2026-10-21** — Nace ANOTADOR GAMMA. App estática de tareas por categorías. Se armó desde cero: HTML semántico → partials, CSS de 0, JS modular, iconos SVG propios (se sacaron todos los emojis), pestañas Tareas/Estadísticas, dashboard con anillo de completitud + KPI tiles + balance por categoría + lectura automática del tablero + heatmap de 7 días. Publicada en GitHub (`gammaautomatizaciones-rc/ANOTADOR-GAMMA`) con GitHub Pages.
- **2026-10-22** — Dashboard reordenado: actividad de 7 días como tira compacta arriba (celdas 34×24 + contador de acciones) y balance / lectura del tablero grandes con scroll interno (430px, `.panel-scroll`). Deep-link por hash (`index.html#stats`).
- **2026-10-22** — Pantalla de carga profesional: overlay full-screen con la marca dibujándose sola (stroke-dashoffset), barra de progreso con pasos reales (partials → init → fonts), salida con fade. Mínimo 700ms visible para que no parpadee. Respeto de `prefers-reduced-motion`.
- **2026-10-22** — El ícono del loader **salta**: entra del costado, 3 rebotes con squash & stretch al aterrizar, queda en el centro y cae desvaniéndose. Sombra que se encoge al tomar altura. Ciclo de 1.4s en loop.
- **2026-10-22** — **Versionado de assets (`?v=N`)** en `index.html` y `js/partials.js` (Pages sirve CSS viejo si la URL no cambia) + `diagnostico.html` para verificar reduced-motion y caché. Bug de Pages: **ignora archivos que empiezan con `_`** (Jekyll).

## 🔴 EN QUÉ QUEDAMOS (retomar acá)

### ✅ Lo que YA está hecho (2026-10-21/22)

**Producto:**
- `index.html` (35 líneas) — shell que linkea 12 CSS, carga 3 partials por `fetch` e incluye 11 scripts.
- `partials/` — `header.html` (marca + acciones globales en una fila), `sidebar.html`, `main.html` (tabs + vistas + footer).
- `css/` — 12 archivos, ninguno >150 líneas: `base`, `sidebar`, `main`, `category`, `tasks`, `stats`, `insights`, `tabs`, `layout`, `animations`, `loader`, `loader-anim`.
- `js/` — 11 módulos, ninguno >150 líneas: `icons`, `loader`, `storage`, `render`, `tasks`, `categories`, `io`, `stats`, `stats-view`, `app`, `partials`.
- `diagnostico.html` — página de diagnóstico (reduced-motion del SO + ¿CSS nuevo en caché?).

**Funcionalidad:**
- Categorías: crear, renombrar (inline), eliminar, seleccionar.
- Tareas: agregar (Enter o botón), editar inline, 3 estados, eliminar con animación, filtro y búsqueda.
- Dashboard (pestaña aparte): anillo de completitud, 4 KPI tiles, balance por categoría, insights automáticos (incluye resumen general), heatmap de 7 días.
- Import/export JSON (archivo, portapapeles o texto pegado). Persistencia en `localStorage` (`AG_tasks`).
- Loader con salto + barra de progreso real. Deep-link `#stats`.

**Diseño:** negro/dorado, Roboto, iconos SVG inline propios (Lucide-style, `stroke: currentColor`), transiciones unificadas (`--dur: 220ms` + `--ease-out`), responsive 768px.

**GitHub:** repo público `gammaautomatizaciones-rc/ANOTADOR-GAMMA` · Pages en `main`/`/` · 12 commits.

### ✅ CERRADO (2026-10-22)
- Login/contraseña eliminado. Layout arreglado (sidebar de punta a punta, main con scroll propio).
- HTML en partials + CSS en 12 archivos + JS en 11 módulos (regla de 150 líneas).
- Tabs Tareas/Estadísticas. Emojis → SVG. Botones de estado rediseñados (sobrios, sin gradiente, sin pulso).
- Card de categoría estirada a full width y compactada; tareas en una línea en `≥900px`.
- **Bug de índice desfasado en `deleteTask`** encontrado por test y corregido (busca por `createdAt`).
- **Re-animado masivo** eliminado: los contenedores re-renderizados no animan; solo los eventos reales.
- Variables CSS faltantes (`--radius-sm`, `--ease-standard`) detectadas y agregadas.
- Versionado de assets + página de diagnóstico. Documentación de contexto completa.

### ⏳ PENDIENTE

1. **🔴 PERSISTENCIA CONFIABLE — el #1.** Los datos viven solo en `localStorage`: si se limpian los datos del navegador o se cambia de máquina, **se pierde todo**. Alternativas: (a) auto-export al detectar `beforeunload`, (b) aviso visible + "Exportar" destacado en la UI, (c) backup a un backend. **Es lo que más valor da de todo lo que falta.**
2. **Deshacer el borrado de una tarea** (hoy un click de más y se perdió).
3. **Mover los tests headless al repo** (`detalles/test-headless.js`) — hoy viven en `%TEMP%\kilo\` y se pierden al limpiar temp.
4. **CI**: que los tests se corran en cada push (GitHub Actions).
5. **Favicon** (se ve el ícono default del browser) + pista visual de que el texto de la tarea es editable.
6. **Card muy ancha**: en pantallas grandes el texto queda pegado al borde izquierdo. Un `max-width` al **texto** (no a la card) lo arregla.
7. `TREE.md` se regenera con `python C:/Users/Gaston/.claude/hooks/generate-tree.py <root>` (NO corre solo en subagentes → regenerar a mano).
8. **Fuera del proyecto (memoria global):** evaluación de Free Claude Code (proxy de 61 providers) en `~/.claude/memory/tecnico/free-claude-code.md`. **PENDIENTE por decisión de Gaston** (miedo a tocar el server de producción). El argumento real a favor NO es "más Claude" sino los +6 modelos open de coding (Kimi K2, Qwen3-Coder, GLM-4.6) que hoy no están en Kilo, con fallback automático.

## Decisiones clave

**Sin backend ni build** (2026-10-21) — HTML/CSS/JS puro en GitHub Pages. Cero costo, cero dependencias, cero build. Tradeoff: sin sincronización entre dispositivos.

**Partials con `fetch` en vez de un HTML único** (2026-10-21) — modularizar sin build step. Costo: **no funciona con `file://`** (`REGLAS_DESARROLLO.md` §1).

**Scripts clásicos y no ES modules** (2026-10-21) — `type="module"` rompe los `<script>` inline con `onclick="changeStatus(...)"` que usa el render. Con scripts clásicos los handlers inline funcionan y el orden de carga es explícito.

**Sin emojis, iconos SVG propios** (2026-10-21) — pedido explícito de Gaston. Set propio en `js/icons.js` (Lucide-style) en vez de librería externa.

**Insights con reglas, no con IA** (2026-10-21) — heurísticas locales (umbral de % completado, categoría sobrecargada, tareas en progreso simultáneas, duplicados, categorías vacías). Cero costo, cero API key, instantáneo. Para LLM real: cambiar `generateInsights()`.

**Animar solo eventos reales** (2026-10-22) — `renderMain`/`renderStats` recrean el `innerHTML`: si el contenedor base tiene `animation`, se repite en cada acción. Solo animan `.task.adding`, `.task.removing`, `.task.status-change`, `.category-item.adding`.

**Versionado de assets obligatorio** (2026-10-22) — `?v=N` en `index.html` y `js/partials.js`. **En cada deploy hay que subir `N+1`** o el usuario ve CSS viejo (`REGLAS_DESARROLLO.md` §8).

**Todo en mayúsculas** (2026-10-21) — comportamiento del anotador original, conservado en `editTask` y `editCategory`.

## Datos técnicos importantes

- **URL local**: `http://127.0.0.1:5500` (Live Server o `python -m http.server 5500`).
- **URL pública**: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/
- **Diagnóstico**: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/diagnostico.html
- **Repo**: `gammaautomatizaciones-rc/ANOTADOR-GAMMA` (público, branch `main`).
- **Clave de persistencia**: `AG_tasks` en `localStorage`.
- **PAT de GitHub**: `~/.claude/credenciales/key_github_gammaautomatizaciones-rc.md` (fine-grained, sin expiración, Contents RW + Pages RW).
- **⚠️ `gh` CLI tiene el token INVÁLIDO** en el keyring → usar el PAT de arriba.
