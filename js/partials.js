const PARTIALS = [
    { url: 'partials/header.html', target: 'partial-header' },
    { url: 'partials/sidebar.html', target: 'partial-sidebar' },
    { url: 'partials/main.html', target: 'partial-main' }
];

function showFatal(message, detail) {
    document.getElementById('app').innerHTML =
        `<p style="padding:24px;color:#fff">${message}</p>`;
    console.error('[Anotador]', message, detail);
}

async function loadPartials() {
    try {
        await Promise.all(PARTIALS.map(async p => {
            const res = await fetch(p.url);
            if (!res.ok) throw new Error(`${res.status} en ${p.url}`);
            document.getElementById(p.target).innerHTML = await res.text();
        }));
    } catch (err) {
        showFatal('No se pudieron cargar los componentes. Serví la carpeta con un servidor local (Live Server) en vez de abrir el archivo con doble clic.', err);
        return;
    }

    try {
        initApp();
    } catch (err) {
        showFatal('Error al iniciar la aplicación.', err);
    }
}

loadPartials();
