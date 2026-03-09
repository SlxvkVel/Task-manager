import { Task } from './Task.js';

export class TaskManager {
    constructor(storageKey = 'tasks') {
        this.storageKey = storageKey;
        this.tasks = this.load();
        this.currentFilter = 'all';
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return [];
        try {
            const plain = JSON.parse(data);
            return plain.map(taskData => Task.fromJSON(taskData));
        } catch {
            return [];
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks.map(t => t.toJSON())));
    }

    addTask(taskData) {
        const task = new Task(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.reminderTime
        );
        this.tasks.push(task);
        this.save();
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    }

    updateTask(id, newData) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.update(newData);
            this.save();
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.toggleComplete();
            this.save();
        }
    }

    getFilteredTasks(filter = this.currentFilter) {
        if (filter === 'active') return this.tasks.filter(t => !t.completed);
        if (filter === 'completed') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    getTasksDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.tasks.filter(t => 
            t.dueDate && 
            new Date(t.dueDate) >= today && 
            new Date(t.dueDate) < tomorrow &&
            !t.completed
        );
    }
}