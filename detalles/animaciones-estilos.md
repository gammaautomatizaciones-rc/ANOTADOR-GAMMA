# Animaciones — Estilos y aplicación

> Parte 2 de 2 de la guía de referencia. Ver `../GUIA_ANIMACIONES_ESTILOS.md`.

## 5. Técnicas de estilos distintos y modernos

### Variables CSS (design tokens)

```css
:root {
    --primary: #FFD700;
    --bg: #0A0A0A;
    --card: #161616;
    --text: #FFFFFF;
    --text-muted: #B0B0B0;
    --border: #333333;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 4px 12px rgba(0,0,0,0.5);
}
```

### Sombras: por capas, no una sola

Una sombra única y dura hace que la UI se vea "template". Las sombras reales son varias capas: un contacto cerca de la superficie (contacto) y otra amplia y difusa (ambiente).

| Nivel | Token | Uso |
|---|---|---|
| 0 | `none` o hairline 1px | Inputs, filas, cards planas |
| 1 | `--shadow-sm` | Cards en reposo, botones presionables |
| 2 | `--shadow-md` | Cards en hover, dropdowns, popovers |
| 3 | `--shadow-lg` | Modales, sheets, dialogs |

```css
--shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.45), 0 1px 1px 0 rgba(0,0,0,0.3);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.4);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -2px rgba(0,0,0,0.4);
```

**Performance**: animar `box-shadow` repinta en cada frame. Para un hover con sombra grande, ponla en un `::after` y animá `opacity` (composite, sin repaint):

```css
.card { position: relative; box-shadow: var(--shadow-sm); }
.card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    transition: opacity 200ms ease-out;
    pointer-events: none;
}
.card:hover::after { opacity: 1; }
```

### Glassmorphism

```css
.glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
}
```

El "agujero" de un donut con `conic-gradient` NO es un agujero real: es un `radial-gradient` del color de fondo pintado encima. Sobre un fondo con gradient o foto, se ve un disco oscuro. Para un agujero real: `mask-image` o un anillo SVG con `stroke`.

### Conic-gradient para anillos de progreso

```css
.ring {
    --pct: 0;
    position: relative;
    width: 108px;
    height: 108px;
    border-radius: 50%;
    background: conic-gradient(var(--primary) calc(var(--pct) * 1%), #2A2A2A 0);
    display: grid;
    place-items: center;
}
.ring::before {
    content: '';
    position: absolute;
    inset: 11px;
    border-radius: 50%;
    background: var(--card);
}
```

El percentage dentro de un gradient no es interpolable, así que animar el `--pct` requiere `@property` (o el salto se ve al cambiar el valor).

### Scrollbar personalizado

```css
::-webkit-scrollbar { width: 9px; }
::-webkit-scrollbar-track { background: var(--card); border-radius: 5px; }
::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, var(--primary), #FFA500);
    border-radius: 5px;
    border: 2px solid var(--card);
}
```

### Responsive (mobile-first)

```css
@media (max-width: 768px) {
    #app { flex-direction: column; }
    #sidebar { width: 100%; border-right: none; }
}
```

## 6. Estados vacíos con valor

Un estado vacío no es un espacio en blanco: es una oportunidad de蓦strar el producto y darle el siguiente paso.

Anatomía:

```
[Ilustración/ícono]   — visual, en el tono del mood (opcional)
[Headline]            — qué ve el usuario (breve, específico)
[Body text]           — por qué está vacío + qué hacer (1-2 frases)
[CTA primario]        — la acción que llena el estado
[CTA secundario]      — opcional: importar, aprender más
```

- Tono: **`all-clear`** (todo hecho) · **`no-results`** (búsqueda sin match) · **`first-use`** (nunca usado) · **`error`**.
- Nunca dejar un vacío completamente en blanco.
- Siempre ofrecer un camino a adelante.
- El mensaje tiene que estar en el DOM (lo leen los lectores de pantalla), con `aria-live="polite"` si es dinámico.

Ejemplo aplicado en este proyecto (`js/render.js`):

```html
<div class="empty-state">
    <div class="empty-icon">…svg…</div>
    <h3>Selecciona una categoría</h3>
    <p>Elige una categoría del sidebar para ver y gestionar sus tareas.</p>
</div>
```

## 7. Checklist antes de publicar una animación

- [ ] ¿Tiene un propósito (feedback, continuidad, jerarquía)?
- [ ] ¿Anima solo `transform` y `opacity`?
- [ ] ¿Duración adecuada al tipo de interacción?
- [ ] ¿Respetó `prefers-reduced-motion: reduce`?
- [ ] ¿Es interrumpible (transiciones, no keyframes en interactivos)?
- [ ] ¿Focus visible mantenido?
- [ ] ¿No parpadea más de 3 veces por segundo?
- [ ] ¿Funciona en móvil y desktop?
- [ ] ¿No bloquea interacciones mientras se anima?

## 8. Cómo quedó aplicado en ANOTADOR GAMMA

| Animación | Dónde | Cuándo |
|---|---|---|
| `fadeInUp` | contenido general | (desactivado en contenedores re-renderizados) |
| `slideInSidebar` | `.category-item.adding` | al crear una categoría |
| `taskAdded` | `.task.adding` | al agregar una tarea |
| `taskRemoved` | `.task.removing` | al eliminar una tarea |
| `statusFlash` | `.task.status-change` | al cambiar el estado de una tarea |
| `pulseGlow` | (eliminado) | era un pulso infinito en hover: se veía "pocu serio" |

Todas las transiciones usan `--dur: 220ms` + `--ease-out`.
