function logLocalStorage() {
    console.log('=== LOCAL STORAGE CONTENTS (SORTED) ===');
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    keys.sort();
    keys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    });
    console.log('=== END LOCAL STORAGE ===');
}

function getData() {
    return JSON.parse(localStorage.getItem('AG_tasks')) || { categories: [] };
}

function loadData() {
    const data = getData();
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
}

function saveData(data) {
    localStorage.setItem('AG_tasks', JSON.stringify(data));
    logLocalStorage();
}
