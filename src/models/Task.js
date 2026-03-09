export class Task {
    constructor(title, description = '', dueDate = null, reminderTime = null) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 5);
        this.title = title;
        this.description = description;

        // dueDate
        if (dueDate) {
            const date = new Date(dueDate);
            this.dueDate = isNaN(date.getTime()) ? null : date;
        } else {
            this.dueDate = null;
        }

        // reminderTime
        if (reminderTime) {
            const date = new Date(reminderTime);
            this.reminderTime = isNaN(date.getTime()) ? null : date;
        } else {
            this.reminderTime = null;
        }

        this.completed = false;
        this.createdAt = new Date(); // всегда валидная
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update(data) {
        if (data.title !== undefined) this.title = data.title;
        if (data.description !== undefined) this.description = data.description;
        if (data.dueDate !== undefined) {
            if (data.dueDate) {
                const date = new Date(data.dueDate);
                this.dueDate = isNaN(date.getTime()) ? null : date;
            } else {
                this.dueDate = null;
            }
        }
        if (data.reminderTime !== undefined) {
            if (data.reminderTime) {
                const date = new Date(data.reminderTime);
                this.reminderTime = isNaN(date.getTime()) ? null : date;
            } else {
                this.reminderTime = null;
            }
        }
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate && !isNaN(this.dueDate.getTime()) ? this.dueDate.toISOString() : null,
            reminderTime: this.reminderTime && !isNaN(this.reminderTime.getTime()) ? this.reminderTime.toISOString() : null,
            completed: this.completed,
            createdAt: this.createdAt && !isNaN(this.createdAt.getTime()) ? this.createdAt.toISOString() : null,
        };
    }

    static fromJSON(json) {
        // Создаём задачу без передачи дат (они будут установлены ниже)
        const task = new Task(json.title, json.description);
        task.id = json.id;
        task.completed = json.completed;

        // Восстанавливаем даты с проверкой
        if (json.dueDate) {
            const d = new Date(json.dueDate);
            task.dueDate = isNaN(d.getTime()) ? null : d;
        } else {
            task.dueDate = null;
        }

        if (json.reminderTime) {
            const d = new Date(json.reminderTime);
            task.reminderTime = isNaN(d.getTime()) ? null : d;
        } else {
            task.reminderTime = null;
        }

        if (json.createdAt) {
            const d = new Date(json.createdAt);
            task.createdAt = isNaN(d.getTime()) ? new Date() : d;
        } else {
            task.createdAt = new Date();
        }

        return task;
    }
}