let currentCategoryIndex = null;
let currentSearch = '';
let currentFilter = 'all';
let animatingTask = null;
let animatingCategory = null;
let currentView = 'tasks';

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.tab-btn').forEach(b => {
        const on = b.dataset.view === view;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('active', v.id === 'view-' + view);
    });
}
function initApp() {
    mountIcons();
    setupTabs();
    logLocalStorage();
    loadData();
    document.getElementById('add-category-form').addEventListener('submit', addCategory);
    document.getElementById('search-input').addEventListener('input', updateSearch);
    document.getElementById('filter-select').addEventListener('change', updateFilter);
    document.getElementById('import-input').addEventListener('change', importData);
    if (location.hash === '#stats') switchView('stats');
}
