const LOADER_MIN_VISIBLE = 900;
const loaderStart = Date.now();
let loaderProgress = 0;
let loaderDone = false;

function initLoader() {
    const el = document.getElementById('loader');
    if (el) el.classList.add('is-visible');
    setLoaderProgress(15);
}

function setLoaderProgress(value) {
    loaderProgress = Math.max(loaderProgress, value);
    const bar = document.getElementById('loader-progress');
    if (bar) bar.style.width = loaderProgress + '%';

    const status = document.getElementById('loader-status');
    if (!status) return;
    if (loaderProgress >= 100) status.textContent = 'Listo';
    else if (loaderProgress >= 60) status.textContent = 'Casi listo';
    else if (loaderProgress >= 35) status.textContent = 'Cargando tus categorías';
    else status.textContent = 'Preparando tu tablero';
}

function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;

    const elapsed = Date.now() - loaderStart;
    const wait = Math.max(0, LOADER_MIN_VISIBLE - elapsed);

    setTimeout(() => {
        setLoaderProgress(100);
        const el = document.getElementById('loader');
        if (!el) return;
        el.classList.add('is-done');
        setTimeout(() => el.remove(), 450);
    }, wait);
}
