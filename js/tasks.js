function addTask(categoryIndex) {
    const input = document.querySelector('.task-input');
    const text = input.value.trim().toUpperCase();
    if (!text) return;

    const data = getData();
    const taskIndex = data.categories[categoryIndex].tasks.length;
    data.categories[categoryIndex].tasks.push({ text: text, status: 'Pendiente', createdAt: Date.now() });
    saveData(data);

    animatingTask = { categoryIndex, taskIndex, type: 'adding' };
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);

    setTimeout(() => {
        animatingTask = null;
        renderMain(data.categories);
    }, 220);
    setTimeout(() => {
        const field = document.querySelector('.task-input');
        field.value = '';
        field.focus();
    }, 0);
}

function changeStatus(categoryIndex, taskIndex, status) {
    const data = getData();
    const task = data.categories[categoryIndex].tasks[taskIndex];
    task.status = status;
    if (status === 'Completada') {
        task.completedAt = task.completedAt || Date.now();
    } else {
        delete task.completedAt;
    }
    saveData(data);
    animatingTask = { categoryIndex, taskIndex, type: 'status' };
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
    setTimeout(() => { animatingTask = null; }, 450);
}

function deleteTask(categoryIndex, taskIndex) {
    const data = getData();
    const target = data.categories[categoryIndex].tasks[taskIndex];
    if (!target) return;

    const marker = target.createdAt || target.text;
    animatingTask = { categoryIndex, taskIndex, type: 'removing' };
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);

    setTimeout(() => {
        const fresh = getData();
        const list = fresh.categories[categoryIndex].tasks;
        const idx = list.findIndex(t => (t.createdAt || t.text) === marker);
        if (idx === -1) {
            animatingTask = null;
            return;
        }
        list.splice(idx, 1);
        saveData(fresh);
        animatingTask = null;
        renderSidebar(fresh.categories);
        renderMain(fresh.categories);
        renderStats(fresh.categories);
    }, 220);
}

function clearCompleted() {
    const data = getData();
    data.categories.forEach(cat => {
        cat.tasks = cat.tasks.filter(task => task.status !== 'Completada');
    });
    saveData(data);
    renderSidebar(data.categories);
    renderMain(data.categories);
    renderStats(data.categories);
}

function editTask(categoryIndex, taskIndex, text) {
    const data = getData();
    data.categories[categoryIndex].tasks[taskIndex].text = text.trim().toUpperCase();
    saveData(data);
    renderStats(data.categories);
}

function editTaskEl(el, categoryIndex, taskIndex) {
    editTask(categoryIndex, taskIndex, el.innerText.toUpperCase());
}
