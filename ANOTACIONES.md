# ANOTACIONES — ANOTADOR GAMMA

> Pendientes reales, notas de trabajo y bugs resueltos.
> Lo que está en curso o en cola. Lo que ya se resolvió queda abajo como referencia.

## 🔴 Prioridad alta

1. **Persistencia confiable — el #1.** `localStorage` es volátil: si el usuario limpia los datos del navegador, **pierde todo**. Hoy la única salida es exportar JSON a mano. Opciones: (a) auto-export al detectar `beforeunload`, (b) aviso visible en la UI + "Exportar" destacado, (c) sincronizar con un backend. Decidir antes de que le pase a un cliente. Es local, bajo riesgo y el de más valor de toda la lista.
2. **Sin control de acceso.** Cualquiera que abra la URL puede usarla, pero **solo ve sus propios datos** (son locales del navegador). No es un riesgo de datos cruzados; sí es un riesgo si se vende como producto. Para venderlo hay que agregar auth.

## 🟡 Prioridad media

3. **Deshacer el borrado de una tarea.** Hoy un click de más y la tarea desapareció. Un `Ctrl+Z` o un toast con "Deshacer" durante 5s.
4. **Los tests headless están en un path temporal** (`%TEMP%\kilo\test-anotador.js`) y se pierden al limpiar temp. Moverlos al proyecto (`detalles/test-headless.js` — remember: <150 líneas, y si no entra, partir).
5. **Sin CI.** Los tests no se corren solos en cada push. Un GitHub Actions con `node --check js/*.js` + el test headless alcanza.
6. **Falta favicon.** Se ve el ícono default del browser en la pestaña. Hacer un SVG simple (el ícono `clipboard` del set) y linkearlo.
7. **El texto editable no tiene pista visual.** No se sabe que el nombre de la categoría y el texto de la tarea se editan en el lugar. Un cursor `text` + un lápiz sutil al hover.
8. **No hay reordenamiento de tareas.** Se agregan al final de la lista, no se pueden arrastrar. Drag & drop con HTML5 Drag and Drop API.
9. **No hay prioridad ni fecha de vencimiento.** Son las dos features que más se piden en un anotador de tareas. `changeStatus` ya es el lugar natural para colgar un campo más.
10. **El dashboard no tiene rango temporal.** El heatmap mira 7 días fijos. Con más historial, se puede hacer seleccionable (7 / 30 / 90).
11. **Sin exportar a CSV.** Solo JSON. Para planillas, CSV es lo que pide la gente.
12. **Sin modo claro.** Está pensado oscuro desde el origen (tema dorado/negro). Si se hace, es agregar un set de variables en `:root` + un `[data-theme="light"]` + un toggle.
13. **Card muy ancha en pantallas grandes.** El texto de la tarea queda pegado al borde izquierdo con mucho vacío a la derecha. Un `max-width` al **texto** (no a la card) lo arregla sin volver a angostar la card.

## 🟢 Prioridad baja / ideas

14. **Arrastrar una categoría para reordenarlas.** Mismo mecanismo que el punto 8.
15. **Atajos de teclado.** `Ctrl+Enter` en el input, `1/2/3` para cambiar estado, `/` para buscar.
16. **Vista "todas las categorías"**. Ahora hay que entrar a una categoría para ver sus tareas. Una vista global con filtro por categoría.
17. **Contador de caracteres** en el input de tarea (títulos largos rompen el layout en móvil).
18. **Sincronización entre dispositivos.** Hoy los datos son del navegador. Es el upgrade grande si el anotador pasa a ser la herramienta de trabajo diaria.

## Notas de trabajo

- **La regla de 150 líneas** es dura: ningún archivo del proyecto puede pasarla. Si un archivo crece, se parte en módulos (CSS) o se va a `detalles/` (documentación). Los archivos de `detalles/` tampoco pueden pasar de 150.
- **Regla de un solo `source of truth`**: cada dato vive en un solo archivo. Cuando hacía falta duplicarlo, va como `→ ver X`.
- Los IDs y clases del HTML son **contrato con el JS**. Si se renombra uno, hay que actualizar el selector en `js/render.js` y/o `js/stats.js` en el mismo commit. `js/app.js` también los usa en `initApp()`.
- Los `<script>` inline con `onclick="..."` en los templates de `render.js` son el motivo de no usar ES modules: en módulos, los handlers inline no ven el scope del módulo.

## Bugs ya resueltos (referencia)

- **Índice desfasado en `deleteTask`** — el borrado real ocurre a los 220ms (por la animación). Si dentro de esa ventana cambiaba el tamaño de la lista, `splice(taskIndex, 1)` borraba la tarea equivocada. Ahora busca por identidad (`createdAt || text`).
- **Re-animado masivo en cada acción** — `renderMain`/`renderStats` recrean todo el `innerHTML`, así que el `fadeInUp` de los contenedores se repetía en cada cambio de estado (se veía parpadear toda la lista). Ahora solo animan los eventos reales.
- **`renderStats` inexistente** — al partir `script.js` en módulos, la función se quedó en el archivo viejo y `loadData()` tiraba ReferenceError al arrancar. Detectado con test headless.
- **Variables CSS sin definir** — `--radius-sm` y `--ease-standard` se usaban pero no estaban en `:root`; el anillo de progreso de las stats no renderizaba bien.
- **Layout roto** — `#app` era flex column con el header adentro, y el footer cortaba el sidebar a media altura. Ahora: `#app` flex column, `.workspace` flex row con `min-height: 0`, footer dentro del main.
- **Login zombie** — el modal de contraseña estaba en el HTML pero ningún JS lo controlaba. Eliminado.
- **CSS viejo servido por Pages** — subí un CSS nuevo con la misma URL y el browser lo siguió sirviendo del caché: se veía el heatmap con celdas gigantes. Causa: sin versionado de assets. Ahora todo se linkea con `?v=N` y **hay que bumpearlo en cada deploy** (`REGLAS_DESARROLLO.md` §8).
- **404 en un archivo con `_` al inicio** — GitHub Pages construye con Jekyll e **ignora** los archivos `_algo.html`: nunca se publican. Renombrado a `diagnostico.html`.
