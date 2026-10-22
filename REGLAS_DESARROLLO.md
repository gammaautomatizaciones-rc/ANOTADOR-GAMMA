# REGLAS DE DESARROLLO — ANOTADOR GAMMA

> Leer COMPLETO antes de tocar código. Acá están los patrones que ROMPEN cosas.
> No son estilo: son trampas reales que ya costaron tiempo.

## 1. La app NO funciona con `file://`

Los partials se cargan con `fetch`. Abriendo `index.html` con doble clic, `fetch` falla por CORS de archivo local y la pantalla queda en el mensaje de error.

- **Siempre** servir por HTTP: `python -m http.server 5500` o Live Server.
- GitHub Pages sirve por HTTP → funciona.
- Si el error aparece, el mensaje en pantalla distingue si fue fallo de **carga** o de **init** (dos handlers separados en `js/partials.js`, a propósito).

## 2. `display: contents` en los wrappers de partial

`#partial-header`, `#partial-sidebar` y `#partial-main` tienen `display: contents` (`css/base.css`). Sin eso, los wrappers se vuelven items flex propios y el layout se rompe: header arriba de todo, sidebar y main apilados en vez de al costado.

**No borrar ese `display: contents` sin recalcular el flex.**

## 3. Los scripts son clásicos, NO ES modules. El orden importa

No hay `import/export`. Todo vive en el scope global y comparte `<script>` tags en `index.html`.

- El **orden de carga** va en `index.html`: `icons → storage → render → tasks → categories → io → stats → app → partials`.
- `js/app.js` declara los `let` globales (`currentCategoryIndex`, `currentSearch`, `currentFilter`, `animatingTask`, `animatingCategory`, `currentView`).
- ⛔ **TDZ**: un `let` global no existe hasta que su `<script>` corrió. Si un módulo usa `currentCategoryIndex` durante la carga (no en runtime), es **ReferenceError**.
- `js/partials.js` va SIEMPRE último: es el que dispara `initApp()`.

## 4. `renderStats` tiene que existir

`js/storage.js` (`loadData`), `tasks.js`, `categories.js` e `io.js` llaman a `renderStats(categories)`. La función vive en `js/stats.js` y delega en `renderStatsPanel`. Si se borra o renombra, la app no arranca.

## 5. `deleteTask` borra a los 220ms (por la animación)

El borrado real está dentro de un `setTimeout` de 220ms para que se vea la animación de salida. **Dentro de esa ventana el índice de la lista puede cambiar** (ej: el usuario completa otra tarea y `clearCompleted` borra una antes).

- Por eso `deleteTask` busca la tarea por **identidad** (`createdAt || text`), no por índice. `splice(taskIndex, 1)` a secas borraba la tarea equivocada.
- El mismo criterio aplica si se agrega un `deleteTask` para categorías.

## 6. No animar contenedores que se re-renderizan

`renderMain` y `renderStats` re-crean el `innerHTML` completo. **Cualquier `animation` en el contenedor base se repite en cada acción** (al completar una tarea, todas las tareas de la lista hacen fade de nuevo).

- Se anima SOLO lo que es evento real: `.task.adding`, `.task.removing`, `.task.status-change`, `.category-item.adding`.
- Los contenedores (`category-main`, `stats-panel`, `.panel`, `empty-state`) **no** llevan `animation`.

## 7. Cero emojis

Gaston lo pidió explícitamente: los emojis se ven "feos" y rompen el tono. Todo ícono sale de `js/icons.js`:

```js
icon('trash', 14)                    // en templates JS
<span data-icon="download"></span>    // en HTML, se monta con mountIcons()
```

- Para agregar uno: nuevo path en `ICON_PATHS` (Lucide-style, `stroke="currentColor"`), sin color propio.
- `mountIcons()` corre una sola vez en `initApp()`. Los templates JS usan `icon()` directo porque se re-crean.

## 8. Deploy: GitHub Pages

- Repo: `gammaautomatizaciones-rc/ANOTADOR-GAMMA` (público).
- Pages: branch `main`, path `/`. Cada push a `main` dispara el deploy.
- ⚠️ El deploy puede tardar ~1-2 min. Verificar con un **cache-buster** (el edge cache miente): `?v=<timestamp>`.

### ⛔ REGLA OBLIGATORIA: bumpear la versión de los assets

**GitHub Pages cachea los `.css` y `.js`. Si subís un CSS nuevo sin cambiar la URL, el navegador del usuario sigue usando el viejo** — y la app se ve rota sin que nada falle en el server. Pasó el 22/10/2026: el JS nuevo cargó pero `css/insights.css` quedó viejo (celdas del heatmap gigantes).

Todos los assets se linkean con un parámetro de versión:

- `index.html` → `css/base.css?v=1`, `js/app.js?v=1`, etc.
- `js/partials.js` → `partials/header.html?v=1`, etc.

**En cada deploy: subir el `?v=N` a `N+1` en `index.html` Y en `js/partials.js`.** Los partials también se cachean: si no se bumpean, el layout del partial queda viejo aunque el JS sea nuevo.

Verificación post-deploy (con cache-buster, siempre):

```powershell
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
(Invoke-WebRequest "https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/css/insights.css?v=$ts" -UseBasicParsing).Content -match 'repeat\(7, 34px\)'
```

Si devuelve `False`, el deploy todavía no llegó. Si devuelve `True` y el usuario lo ve viejo → es caché del navegador: que haga **Ctrl+Shift+R**.

## 9. Git: el PAT no va en `.git/config`

- El token de `gh` CLI **está inválido** en el keyring (cuenta `gammaautomatizaciones-rc`). Usar el PAT de `~/.claude/credenciales/key_github_gammaautomatizaciones-rc.md`.
- El PAT **no** se escribe en el remote (queda en el historial de comandos de PowerShell y es de largo plazo, sin expiración).
- Push con header temporal, sin persistir la credencial:
  ```powershell
  $T = (Select-String -Path "$HOME\.claude\credenciales\key_github_gammaautomatizaciones-rc.md" -Pattern 'github_pat_[A-Za-z0-9_]{20,}').Matches[0].Value
  $b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("x-access-token:$T"))
  git -c "http.https://github.com/.extraheader=Authorization: Basic $b" push -u origin main
  ```
- `CREDENCIALES.md` está en `.gitignore` y **no se commitea**.

## 10. PowerShell 5.1 y archivos

- `Set-Content -Encoding UTF8` escribe **BOM**. Para HTML/CSS/JS que se sirven tal cual, usar `write` (sin BOM) o `[IO.File]::WriteAllText($p, $t, New-Object System.Text.UTF8Encoding($false))`.
- Filtrar output de `Invoke-WebRequest` / `git`: el error no va a stderr en PowerShell, ensucia el parseo. Filtrar con `Select-String`.

## 11. Datos en `localStorage`: no son backups

Las tareas viven en el navegador (`AG_tasks`). Si el usuario limpia datos del navegador, **pierde todo**. Exportar JSON es el único respaldo. No hay sincronización entre dispositivos (decisión consciente: cero backend, cero costo).

## 12. Los `contenteditable` guardan en mayúsculas

`editTask` y `editCategory` guardan `text.trim().toUpperCase()`. Es intencional (tareas y categorías en mayúsculas, como en el original). Si se quiere distinguir, hay que cambiar **las dos** funciones, no una.

## 13. La pantalla de carga

- El overlay `#loader` está **inline en `index.html`** (no en un partial): tiene que existir en el primer paint, antes de que corra cualquier `fetch`. Si viviera en un partial, no se podría mostrar durante la carga de los partials.
- `js/loader.js` lo controla: `initLoader()` lo muestra, `setLoaderProgress(n)` mueve la barra, `hideLoader()` lo saca.
- **Duración mínima visible: 700ms** (`LOADER_MIN_VISIBLE`). Sin esto, en una recarga rápida el overlay parpadea y se ve peor que no tenerlo. La barra de progreso avanza en pasos reales, no con un timer falso.
- El cierre espera a `document.fonts.ready`: si no, la tipografía salta al aparecer la app.
- `showFatal()` (en `js/partials.js`) **siempre** llama a `hideLoader()`: si los partials fallan, el loader no puede quedar tapando el mensaje de error.
- La marca se dibuja con `stroke-dasharray`/`stroke-dashoffset` (técnica "logo draw-in"): el ícono `clipboard` del set, no un spinner genérico. Los 3 paths tienen `animation-delay` escalonado para que no se dibujen en lockstep.
- Con `prefers-reduced-motion: reduce` el ícono se muestra estático y sin shimmer.

### ⛔ Chrome headless SIEMPRE reporta `prefers-reduced-motion: reduce`

El flag `--force-prefers-reduced-motion=no-preference` **no lo cambia** (verificado el 22/10/2026). Consecuencia: cualquier captura headless de una animación con bloque `prefers-reduced-motion` muestra la **versión estática**, y parece que la animación "no funciona" cuando sí funciona.

Para inspeccionar los frames de una animación:

1. Crear una página de test que re-declare las animaciones con `!important` (gana sobre el bloque del media query).
2. Congelar cada frame con `animation-play-state: paused` + `animation-delay: -Xs` inline **con `!important`** (el shorthand resetea el delay).
3. Renderizar N celdas, una por frame, y capturar una sola imagen.

Ejemplo real: `css/loader.css` (`loaderHop`) se verificó así.

### ⛔ GitHub Pages ignora los archivos que empiezan con `_`

GitHub Pages construye con Jekyll, y todo archivo cuyo nombre empieza con `_` queda **fuera del build** (convención de Jekyll: `_layouts`, `_posts`, `_data`...). Un `404` en un archivo `_algo.html` no es un problema de deploy: **el archivo nunca se publicó**.

- Los partials de este proyecto van sin `_` justamente por eso: `partials/header.html`, `partials/sidebar.html`, `partials/main.html`.
- Para una página de diagnóstico, usar nombre sin underscore: `diagnostico.html`.

### Diagnóstico de animaciones

`diagnostico.html` (en el repo, y por lo tanto en Pages) muestra en pantalla:
- Si `prefers-reduced-motion: reduce` está activo. **Chrome no tiene toggle para esto**: lo hereda de Windows (Configuración → Accesibilidad → Efectos visuales → Animaciones). Por eso no aparece en `chrome://settings/accessibility`.
- Si el `loader.css` cargado tiene el `@keyframes loaderHop` (o sea, si el CSS viejo sigue en el caché).

URL: https://gammaautomatizaciones-rc.github.io/ANOTADOR-GAMMA/diagnostico.html
