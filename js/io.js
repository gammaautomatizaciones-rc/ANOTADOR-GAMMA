function exportData() {
    const data = localStorage.getItem('AG_tasks') || '{"categories":[]}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportToJSON() {
    return localStorage.getItem('AG_tasks') || '{"categories":[]}';
}

function applyImported(data) {
    localStorage.setItem('AG_tasks', JSON.stringify(data));
    currentCategoryIndex = null;
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
    logLocalStorage();
}

function importFromJSON(json) {
    try {
        applyImported(JSON.parse(json));
    } catch (err) {
        alert('Error al importar: JSON inválido');
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            applyImported(JSON.parse(e.target.result));
        } catch (err) {
            alert('Error al importar: archivo inválido');
        }
    };
    reader.readAsText(file);
}
