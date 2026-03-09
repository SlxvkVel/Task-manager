import { TaskManager } from './models/TaskManager.js';
import { ReminderService } from './services/ReminderService.js';
import { NotificationService } from './services/NotificationService.js';
import { createTaskCard } from './blocks/task-card/task-card.js';
import { Modal } from './blocks/modal/modal.js';

(async function init() {
    await NotificationService.requestPermission();

    const taskManager = new TaskManager();
    const reminderService = new ReminderService(taskManager);
    reminderService.start();

    const taskListEl = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const addBtn = document.getElementById('addTaskBtn');
    const modalElement = document.getElementById('taskModal');
    const reminderListEl = document.getElementById('reminderList');
    console.log('addBtn:', addBtn);
    console.log('modalElement:', modalElement);
    console.log('Modal class:', Modal);
    const modal = new Modal(modalElement);

    function renderTasks() {
        const tasks = taskManager.getFilteredTasks();
        taskListEl.innerHTML = '';
        tasks.forEach(task => {
            const card = createTaskCard(
                task,
                (id) => {
                    taskManager.toggleComplete(id);
                    reminderService.resetNotification(id);
                    renderTasks();
                    updateReminders();
                },
                (task) => modal.open('edit', task),
                (id) => {
                    taskManager.deleteTask(id);
                    reminderService.resetNotification(id);
                    renderTasks();
                    updateReminders();
                }
            );
            taskListEl.appendChild(card);
        });
    }

    function updateReminders() {
        const dueToday = taskManager.getTasksDueToday();
        reminderListEl.innerHTML = '';
        if (dueToday.length === 0) {
            reminderListEl.innerHTML = '<li>Нет задач на сегодня</li>';
        } else {
            dueToday.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.title} — до ${new Date(task.dueDate).toLocaleTimeString()}`;
                reminderListEl.appendChild(li);
            });
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            taskManager.setFilter(filter);
            renderTasks();
        });
    });

    addBtn.addEventListener('click', () => modal.open('add'));

    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = modal.getFormData();
        if (data.id) {
            taskManager.updateTask(data.id, {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                reminderTime: data.reminderTime,
            });
            reminderService.resetNotification(data.id);
        } else {
            taskManager.addTask(data);
        }
        modal.close();
        renderTasks();
        updateReminders();
    });

    renderTasks();
    updateReminders();
})();