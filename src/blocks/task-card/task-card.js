export function createTaskCard(task, onToggle, onEdit, onDelete) {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'task-card--completed' : ''}`;
    card.dataset.id = task.id;

    const title = document.createElement('h3');
    title.className = 'task-card__title';
    title.textContent = task.title;

    const desc = document.createElement('p');
    desc.className = 'task-card__description';
    desc.textContent = task.description || 'Нет описания';

    const dueDate = document.createElement('time');
    dueDate.className = 'task-card__date';
    dueDate.textContent = task.dueDate ? `Срок: ${new Date(task.dueDate).toLocaleString()}` : '';

    const actions = document.createElement('div');
    actions.className = 'task-card__actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'button button--icon';
    completeBtn.innerHTML = '✓';
    completeBtn.setAttribute('aria-label', 'Выполнено');
    completeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onToggle(task.id);
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'button button--icon';
    editBtn.innerHTML = '✎';
    editBtn.setAttribute('aria-label', 'Редактировать');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onEdit(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'button button--icon';
    deleteBtn.innerHTML = '🗑';
    deleteBtn.setAttribute('aria-label', 'Удалить');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDelete(task.id);
    });

    actions.append(completeBtn, editBtn, deleteBtn);
    card.append(title, desc, dueDate, actions);
    return card;
}