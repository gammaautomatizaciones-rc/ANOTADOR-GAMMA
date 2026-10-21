function addCategory(event) {
    event.preventDefault();
    const input = document.getElementById('category-input');
    const name = input.value.trim().toUpperCase();
    if (!name) return;

    const data = getData();
    data.categories.push({ name: name, tasks: [] });
    saveData(data);

    currentCategoryIndex = data.categories.length - 1;
    animatingCategory = currentCategoryIndex;
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);

    setTimeout(() => {
        animatingCategory = null;
    }, 300);

    input.value = '';
    input.focus();
}

function deleteCategory(index) {
    if (!confirm('¿Eliminar esta categoría y todas sus tareas?')) return;

    const data = getData();
    data.categories.splice(index, 1);
    if (currentCategoryIndex === index) currentCategoryIndex = null;
    else if (currentCategoryIndex > index) currentCategoryIndex--;

    saveData(data);
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
}

function selectCategory(index) {
    currentCategoryIndex = index;
    const data = getData();
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
}

function editCategory(index, name) {
    const data = getData();
    data.categories[index].name = name.trim().toUpperCase();
    saveData(data);
    renderSidebar(data.categories);
    renderStats(data.categories);
}

function editCat(el, index) {
    editCategory(index, el.innerText.toUpperCase());
}

function updateSearch() {
    currentSearch = document.getElementById('search-input').value.toLowerCase();
    const data = getData();
    renderMain(data.categories);
}

function updateFilter() {
    currentFilter = document.getElementById('filter-select').value;
    const data = getData();
    renderMain(data.categories);
}
