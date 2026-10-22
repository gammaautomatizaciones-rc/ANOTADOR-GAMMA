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

    const total = days.reduce((s, d) => s + d.count, 0);
    const active = days.filter(d => d.count > 0).length;

    return {
        html: `<div class="heatmap">${cells}</div><div class="heat-labels">${labels}</div>`,
        total: total,
        activeDays: active
    };
}

function renderStats(categories) {
    renderStatsPanel(categories);
}

function renderStatsPanel(categories) {
    const m = collectMetrics(categories);
    const insights = generateInsights(m, categories);
    const heat = renderHeatmap(categories);

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
        <div class="panel activity-panel">
            <h3>${icon('flame', 15)} Actividad 7 días</h3>
            <div class="activity-heat">${heat.html}</div>
            <span class="activity-total">${heat.total} acciones · ${heat.activeDays} días con movimiento</span>
        </div>
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
                <div class="panel-scroll">${cats}</div>
            </div>
            <div class="panel">
                <h3>${icon('brain', 15)} Lectura del tablero</h3>
                <div class="panel-scroll">${insightHtml}</div>
            </div>
        </div>
    `;
}
