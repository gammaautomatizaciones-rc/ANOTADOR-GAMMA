const PARTIALS = [
    { url: 'partials/header.html?v=3', target: 'partial-header' },
    { url: 'partials/sidebar.html?v=3', target: 'partial-sidebar' },
    { url: 'partials/main.html?v=3', target: 'partial-main' }
];

function showFatal(message, detail) {
    hideLoader();
    document.getElementById('app').innerHTML =
        `<p style="padding:24px;color:#fff">${message}</p>`;
    console.error('[Anotador]', message, detail);
}

async function loadPartials() {
    initLoader();

    try {
        await Promise.all(PARTIALS.map(async p => {
            const res = await fetch(p.url);
            if (!res.ok) throw new Error(`${res.status} en ${p.url}`);
            document.getElementById(p.target).innerHTML = await res.text();
        }));
    } catch (err) {
        showFatal('No se pudieron cargar los componentes. ServÃƒÂ­ la carpeta con un servidor local (Live Server) en vez de abrir el archivo con doble clic.', err);
        return;
    }

    setLoaderProgress(55);

    try {
        initApp();
    } catch (err) {
        showFatal('Error al iniciar la aplicaciÃƒÂ³n.', err);
        return;
    }

    setLoaderProgress(80);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => hideLoader());
    } else {
        hideLoader();
    }
}

loadPartials();
