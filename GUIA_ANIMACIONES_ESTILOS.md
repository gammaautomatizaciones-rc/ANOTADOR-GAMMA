# Guía de Referencia: Animaciones Profesionales y Estilos Web

> **Índice.** El detalle está partido en `detalles/` por la regla de 150 líneas.
> Fuentes: web.dev, MDN, artículos de animación UI/UX (2024-2026).

## Archivos de detalle

| Archivo | Qué tiene |
|---|---|
| `detalles/animaciones-fundamentos.md` | Principios, duraciones, easing, transiciones vs keyframes, accesibilidad |
| `detalles/animaciones-estilos.md` | Técnicas de estilos modernos, checklist, cómo quedó aplicado en este proyecto |

## TL;DR — las 7 reglas que importan

1. **Animate solo `transform` y `opacity`.** El resto (width, height, margin, top) fuerza layout + paint y te tira los frames. Es la regla que más性能 importa.
2. **Duraciones por tipo de interacción**: 100-150ms (micro-feedback) · 200-300ms (componentes) · 300-500ms (pantallas). Más corto se siente instantáneo; más largo se siente lento.
3. **Easing según dirección**: `ease-out` para entradas (arranca rápido, frena suave), `ease-in` para salidas, `cubic-bezier(0.4, 0, 0.2, 1)` como estándar.
4. **Respetá `prefers-reduced-motion: reduce`.** Obligatorio. Corta animaciones a ~0 sin romper la UI.
5. **Transiciones para estados interactivos, `@keyframes` para secuencias.** Una transición se puede interrumpir; una animación, no.
6. **Cada animación tiene que comunicar algo**: feedback, continuidad o jerarquía. Si solo decora, sobra.
7. **Un archivo < 150 líneas.** Si el CSS crece, se parte en módulos; si un doc crece, se va a `detalles/`.

## Lo que usa este proyecto

```css
:root {
    --dur: 220ms;
    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- Transiciones: `var(--dur) var(--ease-out)` en `background`, `border-color`, `color`, `transform`, `box-shadow`.
- Keyframes: `fadeInUp`, `slideInSidebar`, `taskAdded`, `taskRemoved`, `statusFlash` (`css/animations.css`).
- Reduced motion: bloque global en `css/layout.css`.

## Trampa de este proyecto

`renderMain()` y `renderStats()` recrean el `innerHTML` completo. **Cualquier `animation` en el contenedor base se repite en cada acción** (se ve parpadear toda la lista al cambiar un estado).

Se anima SOLO lo que es evento real: `.task.adding`, `.task.removing`, `.task.status-change`, `.category-item.adding`. Los contenedores van sin `animation`.

Ver `REGLAS_DESARROLLO.md` §6.
