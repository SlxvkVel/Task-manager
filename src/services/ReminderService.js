import { NotificationService } from './NotificationService.js';

export class ReminderService {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.interval = null;
        this.notifiedTaskIds = new Set();
    }

    start() {
        if (this.interval) return;
        this.interval = setInterval(() => this.checkReminders(), 60000);
        this.checkReminders();
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    checkReminders() {
        const now = new Date();
        this.taskManager.tasks.forEach(task => {
            if (task.completed) return;
            if (task.reminderTime && new Date(task.reminderTime) <= now && !this.notifiedTaskIds.has(task.id)) {
                NotificationService.notify('Напоминание о задаче', {
                    body: task.title,
                    icon: '/favicon.ico',
                });
                this.notifiedTaskIds.add(task.id);
            }
        });
    }

    resetNotification(taskId) {
        this.notifiedTaskIds.delete(taskId);
    }
}