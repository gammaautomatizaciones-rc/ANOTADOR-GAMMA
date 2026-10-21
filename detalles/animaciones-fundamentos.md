# Animaciones — Fundamentos

> Parte 1 de 2 de la guía de referencia. Ver `../GUIA_ANIMACIONES_ESTILOS.md`.

## 1. Principios fundamentales

### Propósito de la animación

Cada animación debe cumplir uno de estos tres trabajos:

| Trabajo | Ejemplo |
|---------|---------|
| **Feedback** | Confirmar un click, un toggle, un guardado exitoso |
| **Continuidad** | Mostrar de dónde viene un elemento nuevo |
| **Jerarquía** | Dirigir la atención al elemento que cambió |

Si una animación solo decora y no comunica nada, quítala o mantenla muy corta.

### Regla de oro de rendimiento

Animate **solo** estas propiedades (viven en el composite layer, 60fps):

- `opacity`
- `transform` (translate, scale, rotate)

Evita animar: `width`, `height`, `margin`, `padding`, `top`, `left` (forzan layout + paint).

```css
/* Barato: solo composite */
.bueno { transition: transform 0.2s ease-out, opacity 0.2s ease-out; }

/* Caro: layout + paint en cada frame */
.malo { transition: width 0.3s, margin 0.3s, top 0.3s; }
```

### will-change

Usarlo solo cuando notes problemas de rendimiento, nunca en `*` global.

```css
.card.is-animating { will-change: transform, opacity; }
```

Promover muchos elementos a capas GPU consume memoria y puede EMPEORAR el rendimiento.

## 2. Duraciones y easing por tipo de interacción

| Interacción | Duración | Easing | Uso |
|-------------|----------|--------|-----|
| Botón / toggle / micro-feedback | 100-150ms | `ease-out` | Respuesta instantánea |
| Hover / affordance | 150-200ms | `ease-out` | Señalar interactividad |
| Dropdown / modal / componente | 200-300ms | `cubic-bezier(0.4,0,0.2,1)` | Reveal estructural |
| Transición de pantalla / ruta | 300-500ms | `ease-in-out` | Cambio de vista mayor |
| Decorativo / onboarding | 500-1000ms | `ease-in-out` | Con moderación |
| Stagger (lista de ítems) | 20-50ms por ítem | `ease-out` | Tope ~300ms total |

### Tokens recomendados

```css
:root {
    --motion-fast: 120ms;
    --motion-base: 220ms;
    --motion-slow: 320ms;
    --ease-out: cubic-bezier(0.2, 0, 0, 1);
    --ease-in: cubic-bezier(0.3, 0, 1, 1);
    --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Unificar el timing en tokens es lo que hace que una interfaz se vea "coherente". Con valores sueltos por componente, cada uno se siente de un software distinto.

## 3. Transiciones vs @keyframes

| | `transition` | `@keyframes` |
|---|-------------|--------------|
| Se dispara cuando | Cambia una propiedad (hover, focus, clase) | Se aplica al elemento |
| Pasos | Inicio y fin | Tantos como definas |
| Repite | No | `animation-iteration-count` |
| Reversible | Sí (interrumpible) | No fácilmente |
| Mejor para | Estados interactivos | Cargas, entradas, loops |

**Regla**: transiciones para estados interactivos (botones, modales, toggles). Keyframes para secuencias únicas (fade-in al cargar, spinners).

### Ejemplo transition

```css
.btn {
    transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.btn:active { transform: scale(0.96); }
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
```

### Ejemplo keyframes

```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}

.task { animation: fadeInUp 220ms ease-out both; }
```

El `both` en `animation-fill-mode` importa: sin él, hay un flash entre el estado inicial y el primer frame.

## 4. Accesibilidad: prefers-reduced-motion

Es obligatorio respetar la preferencia del sistema del usuario.

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

No es un detalle: personas con disorder vestibulariek trigger con movimiento. Además, muchos usuarios de OS lo tienen activado por serSave the battery.

### Otros puntos de accesibilidad

- Nunca quites `:focus-visible` sin reemplazarlo por otro indicador equally visible.
- No uses **solo color** para indicar estado (añade ícono o texto).
- Los toasts y alertas necesitan `role="status"` o `role="alert"`.
- Hit areas mínimas: 24×24px (ideales 44×44px en móvil, 40×40px en desktop).
- Todo lo clickeable debe ser activable con teclado (Enter / Space).
- Los estados vacíos van en el DOM, no solo decorativos: los lectores de pantalla tienen que poder leerlos.
