# HILO DE CONVERSACIÓN — ANOTADOR GAMMA

## Diario (1 línea por sesión)

- **2026-10-21** — Nace ANOTADOR GAMMA. App estática de tareas por categorías. Se armó desde cero: HTML semántico → partials, CSS de 0 en 10 archivos, JS en 9 módulos, iconos SVG propios (se sacaron todos los emojis), pestañas Tareas/Estadísticas, dashboard con anillo de completitud + KPI tiles + balance por categoría + lectura automática del tablero + heatmap de 7 días. Publicada en GitHub (`gammaautomatizaciones-rc/ANOTADOR-GAMMA`) con GitHub Pages.

## 🔴 EN QUÉ QUEDAMOS (retomar acá)

### ✅ Lo que YA está hecho (2026-10-21)

**Producto:**
- `index.html` (35 líneas) — shell que linkea 10 CSS, carga 3 partials por `fetch` e incluye 9 scripts.
- `partials/` — `header.html` (marca + acciones globales en una fila), `sidebar.html` (categorías), `main.html` (tabs + vistas + footer).
- `css/` — 10 archivos, ninguno >150 líneas: `base`, `sidebar`, `main`, `category`, `tasks`, `stats`, `insights`, `tabs`, `layout`, `animations`.
- `js/` — 9 módulos, ninguno >150 líneas: `icons`, `storage`, `render`, `tasks`, `categories`, `io`, `stats`, `app`, `partials`.

**Funcionalidad:**
- Categorías: crear, renombrar (inline), eliminar, seleccionar.
- Tareas: agregar (Enter o botón), editar inline, 3 estados, eliminar con animación.
- Búsqueda + filtro por estado.
- Dashboard (pestaña separada): anillo de completitud (conic-gradient), 4 KPI tiles con barra, balance por categoría, 4 insights automáticos, heatmap de 7 días.
- Import/export JSON (archivo, portapapeles o texto pegado). Persistencia en `localStorage` (`AG_tasks`).

**Diseño:**
- Paleta negro/dorado, tipografía Roboto.
- Iconos SVG inline propios (Lucide-style, `stroke: currentColor`, sin color).
- Transiciones unificadas: `--dur: 220ms` + `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`.
- Responsive con breakpoint en 768px.

**GitHub:**
- Repo público: `gammaautomatizaciones-rc/ANOTADOR-GAMMA` — https://github.com/gammaautomatizaciones-rc/ANOTADOR-GAMMA
- Pages habilitado: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/ (branch `main`, path `/`).
- Primer commit `7aa7c0b` — 30 archivos.

### ✅ CERRADO ESTA SESIÓN (2026-10-21)
- Login/contraseña eliminado (el modal no estaba ni conectado al JS).
- Layout arreglado: header arriba, sidebar a la izquierda de punta a punta, main con scroll propio.
- HTML partido en partials + CSS en 10 archivos + JS en 9 módulos (regla de 150 líneas).
- Tabs Tareas/Estadísticas para no scrollear.
- Emojis → SVG.
- Botones de estado rediseñados (sobrios, sin gradiente, sin pulse infinito).
- Card de categoría estirada a full width y compactada; tareas en una sola línea en pantallas `≥900px`.
- Bug de índice desfasado en `deleteTask` encontrado por test y corregido (busca por `createdAt`).
- Variables CSS faltantes (`--radius-sm`, `--ease-standard`) detectadas y agregadas.

### ⏳ PENDIENTE (no bloqueantes)
1. **Verificar que la app se vea bien en Pages** (el deploy puede tardar 1-2 min). Probar la URL con cache-buster.
2. **`CREDENCIALES.md`** — creado, queda local (no versionado).
3. **Tests headless**: el mock de DOM quedó en `C:\Users\Gaston\AppData\Local\Temp\kilo\test-anotador.js` (temporal). Si se quiere, mover al proyecto como `detalles/test-headless.js` para que no se pierda.
4. **TREE.md** se regenera con `python C:/Users/Gaston/.claude/hooks/generate-tree.py <root>` (en el hook corre solo, pero NO en subagentes — regenerar a mano).

## Decisiones clave

**Sin backend ni build** (2026-10-21) — HTML/CSS/JS puro servido por GitHub Pages. Cero costo de hosting, cero dependencias, cero proceso de build. El tradeoff: sin sincronización entre dispositivos y sin control de acceso (los datos son del navegador, de cada uno).

**Partials con `fetch` en vez de un HTML único** (2026-10-21) — el `index.html` se había ido a 81 líneas y el pedido era modularizar. `fetch` resuelve el problema sin build step. Costo: **no funciona con `file://`** (ver `REGLAS_DESARROLLO.md` §1).

**Scripts clásicos y no ES modules** (2026-10-21) — `type="module"` exige servidor por CORS igual que los partials, pero además cambia el scoping y rompe los `<script>` inline con `onclick="changeStatus(...)"` que usa el render. Con scripts clásicos, los handlers inline funcionan y el orden de carga es explícito en el HTML.

**Sin emojis, iconos SVG propios** (2026-10-21) — pedido explícito de Gaston: "los emojis son feos, buscá un ícono sin color, solo SVG". Set propio en `js/icons.js` en vez de una librería externa (FontAwesome/Awesome) para no sumar dependencias ni requests.

**Insights automáticos con reglas, no con IA** (2026-10-21) — la "lectura del tablero" se genera con heurísticas locales (umbral de % completado, categoría sobrecargada, tareas en progreso simultáneas, duplicados, categorías vacías). Cero costo, cero API key, instantáneo. Si alguna vez se quiere LLM real, es cambiar la función `generateInsights()` — el resto de la UI no cambia.

**Todo en mayúsculas** (2026-10-21) — comportamiento del anotador original, conservado a propósito en `editTask` y `editCategory`.

## Datos técnicos importantes

- **URL local**: `http://127.0.0.1:5500` (Live Server o `python -m http.server 5500`).
- **URL pública**: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/
- **Repo**: `gammaautomatizaciones-rc/ANOTADOR-GAMMA` (público, branch `main`).
- **Clave de persistencia**: `AG_tasks` en `localStorage`.
- **PAT de GitHub**: `~/.claude/credenciales/key_github_gammaautomatizaciones-rc.md` (fine-grained, sin expiración, Contents RW + Pages RW).
- **⚠️ `gh` CLI tiene el token INVÁLIDO** en el keyring → usar el PAT de arriba.
