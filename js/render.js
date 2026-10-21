function renderSidebar(categories) {
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    categories.forEach((category, index) => {
        const li = document.createElement('li');
        const animClass = animatingCategory === index ? 'adding' : '';
        li.className = `category-item ${currentCategoryIndex === index ? 'active' : ''} ${animClass}`;
        li.innerHTML = `
            <span>${category.name}</span>
            <button onclick="event.stopPropagation(); deleteCategory(${index})" aria-label="Eliminar categoría">${icon('trash', 14)}</button>
        `;
        li.onclick = () => selectCategory(index);
        list.appendChild(li);
    });
}

function renderMain(categories) {
    const content = document.getElementById('category-content');
    if (currentCategoryIndex === null || !categories[currentCategoryIndex]) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${icon('inbox', 28)}</div>
                <h3>Selecciona una categoría</h3>
                <p>Elige una categoría del sidebar para ver y gestionar sus tareas.</p>
            </div>
        `;
        return;
    }
    const category = categories[currentCategoryIndex];
    const taskItems = category.tasks.map((task, taskIndex) => {
        const matchesSearch = task.text.toLowerCase().includes(currentSearch);
        const matchesFilter = currentFilter === 'all' || task.status === currentFilter;
        const isAnim = animatingTask &&
            animatingTask.categoryIndex === currentCategoryIndex &&
            animatingTask.taskIndex === taskIndex;
        const animClass = isAnim
            ? (animatingTask.type === 'adding' ? 'adding'
                : animatingTask.type === 'removing' ? 'removing' : 'status-change')
            : '';
        if (!matchesSearch || !matchesFilter) return '';
        const statusCls = task.status === 'Pendiente' ? 'pending' :
            task.status === 'En Progreso' ? 'in-progress' : 'completed';
        return `<li class="task ${statusCls} ${animClass}">
                    <span contenteditable="true" onblur="editTaskEl(this, ${currentCategoryIndex}, ${taskIndex})" onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}">${task.text}</span>
                    <div class="task-actions">
                        <div class="status-buttons">
                            <button class="status-btn pending-btn ${task.status === 'Pendiente' ? 'active' : ''}" onclick="changeStatus(${currentCategoryIndex}, ${taskIndex}, 'Pendiente')">${icon('clock', 13)} Pendiente</button>
                            <button class="status-btn in-progress-btn ${task.status === 'En Progreso' ? 'active' : ''}" onclick="changeStatus(${currentCategoryIndex}, ${taskIndex}, 'En Progreso')">${icon('repeat', 13)} En Progreso</button>
                            <button class="status-btn completed-btn ${task.status === 'Completada' ? 'active' : ''}" onclick="changeStatus(${currentCategoryIndex}, ${taskIndex}, 'Completada')">${icon('check', 13)} Completada</button>
                        </div>
                        <button onclick="deleteTask(${currentCategoryIndex}, ${taskIndex})" aria-label="Eliminar tarea">${icon('x', 16)}</button>
                    </div>
                </li>`;
    }).join('');

    content.innerHTML = `
        <div class="category-main">
            <div class="category-header">
                <h2 contenteditable="true" onblur="editCat(this, ${currentCategoryIndex})" onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}">${category.name}</h2>
                <div class="category-actions">
                    <button onclick="clearCompleted()">${icon('trash', 13)} Limpiar Completadas</button>
                    <button onclick="exportData()">${icon('download', 13)} Exportar</button>
                    <button onclick="document.getElementById('import-input').click()">${icon('upload', 13)} Importar</button>
                </div>
            </div>
            <div class="add-task">
                <input type="text" class="task-input" placeholder="Nueva tarea" onkeydown="if(event.key==='Enter'){event.preventDefault(); addTask(${currentCategoryIndex});}">
                <button onclick="addTask(${currentCategoryIndex})">${icon('plus', 15)} Agregar Tarea</button>
            </div>
            <ul>${taskItems}</ul>
        </div>
    `;
}
