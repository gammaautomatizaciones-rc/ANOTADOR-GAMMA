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

    out.push({
        icon: 'chart',
        tone: '',
        text: `${m.total} tareas en ${categories.length} categoría${categories.length > 1 ? 's' : ''}: ${m.completed} completadas (${m.pct}%), ${m.inProgress} en progreso y ${m.pending} pendientes.`
    });

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
