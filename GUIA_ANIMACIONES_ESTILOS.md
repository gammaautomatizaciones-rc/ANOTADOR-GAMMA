# 🎨 Guía de Referencia: Animaciones Profesionales y Estilos Web

> Recopilación de mejores prácticas, técnicas y patrones para crear animaciones profesionales y estilos distintivos en páginas web.
>
> Fuente: web.dev, MDN, artículos especializados en animación UI/UX (2024-2026).

---

## 1. Principios fundamentales de animación profesional

### Propósito de la animación
Cada animación debe cumplir uno de estos tres trabajos:

| Trabajo | Ejemplo |
|---------|---------|
| **Feedback** | Confirmar un click, toggle, guardado exitoso |
| **Continuidad** | Mostrar de dónde viene un elemento nuevo |
| **Jerarquía** | Dirigir la atención al elemento que cambió |

Si una animación solo decora y no comunica nada, quítala o mantenla muy corta.

### Regla de oro de rendimiento
Anima **solo** estas propiedades (composite layer, 60fps):

- `opacity`
- `transform` (translate, scale, rotate)

Evita animar: `width`, `height`, `margin`, `padding`, `top`, `left` (forzan layout + paint).

```css
/* ✅ Barato - solo composite */
.bueno { transition: transform 0.2s ease-out, opacity 0.2s ease-out; }

/* ❌ Caro - layout + paint */
.malo { transition: width 0.3s, margin 0.3s, top 0.3s; }
```

### will-change
Úsalo solo cuando notes problemas de rendimiento, nunca en `*` global.

```css
.card.is-animating {
  will-change: transform, opacity;
}
```

---

## 2. Duraciones y easing por tipo de interacción

| Interacción | Duración | Easing | Uso |
|-------------|----------|--------|-----|
| Botón / toggle / micro-feedback | 100–150ms | `ease-out` | Respuesta instantánea |
| Hover / affordance | 150–200ms | `ease-out` | Señalar interactividad |
| Dropdown / modal / componente | 200–300ms | `cubic-bezier(0.4,0,0.2,1)` | Reveal estructural |
| Transición de pantalla / ruta | 300–500ms | `ease-in-out` | Cambio de vista mayor |
| Decorativo / onboarding | 500–1000ms | `ease-in-out` | Usar con moderación |
| Stagger (lista de ítems) | 20–50ms por ítem | `ease-out` | Tope ~300ms total |

### Tokens recomendados (CSS)

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

---

## 3. Transiciones vs @keyframes

| | `transition` | `@keyframes` |
|---|-------------|--------------|
| Se dispara cuando | Cambia una propiedad (hover, focus, clase) | Se aplica al elemento |
| Pasos | Inicio y fin | Tantos como definas |
| Repite | No | `animation-iteration-count` |
| Reversible | Sí (interrumpible) | No fácilmente |
| Mejor para | Estados interactivos | Cargas, entradas, loops |

**Regla:** Transiciones para estados interactivos (botones, modales, toggles). Keyframes para secuencias únicas (fade-in al cargar, spinners).

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

.task {
  animation: fadeInUp 220ms ease-out both;
}
```

---

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

Otros puntos de accesibilidad:
- Nunca quites `:focus-visible` sin reemplazarlo.
- No uses solo color para indicar estado (añade icono o texto).
- Los toasts/alertas necesitan `role="status"` o `role="alert"`.
- Hit areas mínimas: 24×24px (ideales 44×44px móvil, 40×40px desktop).
- Todo lo clickable debe ser activable con teclado (Enter/Space).

---

## 5. Técnicas de estilos distintos y modernos

### Variables CSS (design tokens)

```css
:root {
  /* Colores */
  --primary: #FFD700;
  --secondary: #000000;
  --bg: #000000;
  --card-bg: #333333;
  --text: #FFFFFF;

  /* Sombras */
  --shadow: 0 10px 30px rgba(0,0,0,0.8);
  --shadow-hover: 0 15px 40px rgba(0,0,0,0.9);

  /* Radio y bordes */
  --radius: 12px;
  --radius-sm: 8px;

  /* Motion (ver sección 2) */
}
```

### Glassmorphism (efecto cristal)

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Gradientes y glow

```css
.glow-button {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.18);
  transition: box-shadow var(--motion-fast) ease-out;
}

.glow-button:hover {
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.28);
  background: linear-gradient(45deg, #FFB500, #FFD700);
}
```

### Hover útiles (transform solo)

```css
.card:hover {
  transform: translateY(-4px);
  transition: transform var(--motion-base) var(--ease-standard);
}

.item:active {
  transform: scale(0.95);
}
```

### Scrollbar personalizado

```css
::-webkit-scrollbar { width: 12px; }
::-webkit-scrollbar-track { background: #333333; border-radius: 6px; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 6px;
  border: 2px solid #333333;
}
```

### Responsive (mobile-first)

```css
@media (max-width: 768px) {
  #app { flex-direction: column; }
  #sidebar { width: 100%; border-right: none; }
}
```

---

## 6. Checklist antes de publicar una animación

- [ ] ¿Tiene un propósito (feedback, continuidad, jerarquía)?
- [ ] ¿Anima solo `transform` y `opacity`?
- [ ] ¿Duración adecuada al tipo de interacción?
- [ ] ¿Respetó `prefers-reduced-motion: reduce`?
- [ ] ¿Es interrumpible (transiciones, no keyframes en interactivos)?
- [ ] ¿Focus visible mantenido?
- [ ] ¿No parpadea más de 3 veces por segundo?
- [ ] ¿Funciona en móvil y desktop?
- [ ] ¿No bloquea interacciones mientras se anima?

---

## 7. Archivos del proyecto (ANOTADOR GAMMA)

| Archivo | Rol |
|---------|-----|
| `index.html` | Estructura y modal (login ya eliminado) |
| `styles.css` | Estilos base + tokens de movimiento + animaciones aplicadas |
| `script.js` | Lógica de tareas, categorías, localStorage |
| `GUIA_ANIMACIONES_ESTILOS.md` | Esta guía de referencia |

### Animaciones ya aplicadas en el proyecto

- `slideInSidebar` — entrada de categorías del sidebar
- `fadeInUp` — entrada de contenido principal y tareas
- `taskAdded` / `taskRemoved` — añadir/eliminar tareas (requiere clases JS)
- `pulseGlow` — hover en botones y estado activo
- Micro-interacciones en `:hover` y `:active` de botones, tareas, categorías

---

## 8. Próximas mejoras sugeridas

1. Agregar clases `.adding`/`.removing` en `script.js` para activar animaciones de tarea.
2. Implementar modo claro/oscuro con toggle y variables CSS.
3. Añadir notificaciones toast (`role="status"`) al agregar/eliminar.
4. Drag & drop para reordenar tareas (HTML Drag and Drop API).
5. Filtros de prioridad y fechas de vencimiento.
6. Exportar/importar ya existen; considerar sincronización remota.
