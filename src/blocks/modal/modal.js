export class Modal {
    constructor(modalElement) {
        this.modal = modalElement;
        this.closeBtn = modalElement.querySelector('.modal__close');
        this.cancelBtn = document.getElementById('cancelModal');
        this.form = document.getElementById('taskForm');
        this.titleInput = document.getElementById('taskTitle');
        this.descInput = document.getElementById('taskDesc');
        this.dueDateInput = document.getElementById('taskDueDate');
        this.reminderInput = document.getElementById('taskReminder');
        this.taskIdInput = document.getElementById('taskId');
        this.modalTitle = document.getElementById('modalTitle');

        this.initEvents();
    }

    initEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(mode = 'add', taskData = null) {
        this.modal.classList.add('show');
        if (mode === 'add') {
            this.modalTitle.textContent = 'Новая задача';
            this.form.reset();
            this.taskIdInput.value = '';
        } else if (mode === 'edit' && taskData) {
            this.modalTitle.textContent = 'Редактировать задачу';
            this.titleInput.value = taskData.title || '';
            this.descInput.value = taskData.description || '';
            this.dueDateInput.value = taskData.dueDate ? this.formatDateForInput(new Date(taskData.dueDate)) : '';
            this.reminderInput.value = taskData.reminderTime ? this.formatDateForInput(new Date(taskData.reminderTime)) : '';
            this.taskIdInput.value = taskData.id;
        }
    }

    close() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.form.reset();
        }, 300);
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    getFormData() {
        return {
            id: this.taskIdInput.value || null,
            title: this.titleInput.value.trim(),
            description: this.descInput.value.trim(),
            dueDate: this.dueDateInput.value || null,
            reminderTime: this.reminderInput.value || null,
        };
    }
}