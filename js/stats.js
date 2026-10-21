function dayKey(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function collectMetrics(categories) {
    const m = { total: 0, pending: 0, inProgress: 0, completed: 0, byCategory: [] };

    categories.forEach(cat => {
        let c = 0, p = 0, i = 0, d = 0;
        cat.tasks.forEach(t => {
            m.total++;
            if (t.status === 'Completada') { m.completed++; d++; }
            else if (t.status === 'En Progreso') { m.inProgress++; i++; }
            else { m.pending++; p++; }
        });
        m.byCategory.push({ name: cat.name, total: c + p + i + d, pending: p, inProgress: i, completed: d, pct: c + p + i + d ? Math.round(d / (c + p + i + d) * 100) : 0 });
    });

    m.pct = m.total ? Math.round(m.completed / m.total * 100) : 0;
    return m;
}

function generateInsights(m, categories) {
    const out = [];

    if (m.total === 0) {
        return [{ icon: 'sprout', tone: '', text: 'Todavía no hay tareas. Creá una categoría y arrancá con lo más urgente que tengas en la cabeza.' }];
    }

    if (m.pending === 0 && m.inProgress === 0) {
        out.push({ icon: 'trophy', tone: 'good', text: `Todo al día. ${m.completed} tareas completadas, sin nada pendiente. Buen momento para planificar lo que sigue.` });
    }

    if (m.pct >= 80 && m.total >= 3) {
        out.push({ icon: 'rocket', tone: 'good', text: `Racha fuerte: ${m.pct}% de las tareas están completas. Estás cerrando mucho más de lo que abrís.` });
    } else if (m.pct <= 30 && m.total >= 5) {
        out.push({ icon: 'clock', tone: 'bad', text: `Carga alta: solo ${m.pct}% está completo. Quedan ${m.pending} pendientes — conviene atacar las más pesadas primero.` });
    }

    const overloaded = m.byCategory.filter(c => c.total >= 2 && c.pending > c.completed).sort((a, b) => b.pending - a.pending)[0];
    if (overloaded) {
        out.push({ icon: 'scale', tone: 'warn', text: `"${overloaded.name}" está sobrecargada: ${overloaded.pending} pendientes contra ${overloaded.completed} completadas. Es tu cuello de botella.` });
    }

    if (m.inProgress >= 3 && m.inProgress / m.total > 0.3) {
        out.push({ icon: 'repeat', tone: 'warn', text: `Tenés ${m.inProgress} tareas en progreso al mismo tiempo. Cerrá alguna o vas a arrastrar trabajo a medias.` });
    }

    const empty = m.byCategory.filter(c => c.total === 0);
    if (empty.length) {
        out.push({ icon: 'folder', tone: '', text: `${empty.length} categoría${empty.length > 1 ? 's están' : ' está'} vacía${empty.length > 1 ? 's' : ''}: ${empty.map(c => c.name).join(', ')}. Agregá tareas o sacalas de la lista.` });
    }

    const single = m.byCategory.filter(c => c.total === 1);
    if (single.length >= 2) {
        out.push({ icon: 'filter', tone: '', text: `${single.length} categorías tienen una sola tarea. Agruparlas te baja el ruido y las hacés más fácil de cerrar.` });
    }

    const dupes = {};
    categories.forEach(cat => cat.tasks.forEach(t => {
        const k = t.text.trim().toUpperCase();
        dupes[k] = (dupes[k] || 0) + 1;
    }));
    const repeated = Object.keys(dupes).filter(k => dupes[k] > 1);
    if (repeated.length) {
        out.push({ icon: 'copy', tone: 'warn', text: `Hay ${repeated.length} tarea${repeated.length > 1 ? 's repetidas' : ' repetida'}. Ej: "${repeated[0]}".` });
    }

    if (!out.length) {
        out.push({ icon: 'chart', tone: '', text: `Tenés ${m.total} tareas repartidas en ${categories.length} categorías. Sin anomalías: el tablero está equilibrado.` });
    }

    return out.slice(0, 4);
}

function renderHeatmap(categories) {
    const days = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const key = now.getTime() - i * 86400000;
        days.push({ key, count: 0 });
    }

    categories.forEach(cat => cat.tasks.forEach(t => {
        const stamps = [t.createdAt, t.completedAt].filter(Boolean);
        stamps.forEach(ts => {
            const k = dayKey(ts);
            const hit = days.find(d => d.key === k);
            if (hit) hit.count++;
        });
    }));

    const max = Math.max(1, ...days.map(d => d.count));
    const cells = days.map(d => `<div class="heat-cell" style="--val:${(d.count / max).toFixed(2)}" title="${d.count} actividad(es)"></div>`).join('');
    const labels = days.map(d => {
        const dt = new Date(d.key);
        return `<span>${['D','L','M','M','J','V','S'][dt.getDay()]}</span>`;
    }).join('');

    return `<div class="heatmap">${cells}</div><div class="heat-labels">${labels}</div>`;
}

function renderStats(categories) {
    renderStatsPanel(categories);
}

function renderStatsPanel(categories) {
    const m = collectMetrics(categories);
    const insights = generateInsights(m, categories);

    const tiles = [
        { cls: 'tone-pending', icon: 'clock', label: 'Pendientes', val: m.pending, pct: m.total ? m.pending / m.total * 100 : 0 },
        { cls: 'tone-progress', icon: 'repeat', label: 'En Progreso', val: m.inProgress, pct: m.total ? m.inProgress / m.total * 100 : 0 },
        { cls: 'tone-done', icon: 'check', label: 'Completadas', val: m.completed, pct: m.total ? m.completed / m.total * 100 : 0 }
    ].map(t => `<div class="tile ${t.cls}">
        <div class="tile-top"><span>${icon(t.icon, 13)} ${t.label}</span></div>
        <div class="tile-value">${t.val}</div>
        <div class="tile-bar"><i style="width:${t.pct.toFixed(0)}%"></i></div>
    </div>`).join('');

    const cats = m.byCategory.length
        ? m.byCategory.map(c => `<div class="cat-row">
            <div>
                <div class="cat-name">${c.name} · ${c.completed}/${c.total}</div>
                <div class="cat-track"><i class="cat-fill" style="width:${c.pct}%"></i></div>
            </div>
            <div class="cat-pct">${c.pct}%</div>
        </div>`).join('')
        : '<p style="color:var(--text-muted);font-size:0.85rem">Sin categorías todavía.</p>';

    const insightHtml = insights.map(i => `<div class="insight ${i.tone}"><span class="insight-icon">${icon(i.icon, 16)}</span><span>${i.text}</span></div>`).join('');

    document.getElementById('stats').innerHTML = `
        <div class="stats-panel">
            <div class="ring-wrap">
                <div class="ring" style="--pct:${m.pct}"><span class="ring-value">${m.pct}%</span></div>
                <div class="ring-label">Completado</div>
            </div>
            <div class="stats-tiles">
                <div class="tile">
                    <div class="tile-top"><span>${icon('list', 13)} Total</span></div>
                    <div class="tile-value">${m.total}</div>
                    <div class="tile-bar"><i style="width:100%"></i></div>
                </div>
                ${tiles}
            </div>
        </div>
        <div class="stats-lower">
            <div class="panel">
                <h3>${icon('folder', 15)} Balance por categoría</h3>
                ${cats}
            </div>
            <div class="panel">
                <h3>${icon('brain', 15)} Lectura del tablero</h3>
                ${insightHtml}
            </div>
        </div>
        <div class="panel" style="margin-top:18px">
            <h3>${icon('flame', 15)} Actividad de los últimos 7 días</h3>
            ${renderHeatmap(categories)}
        </div>
    `;
}
