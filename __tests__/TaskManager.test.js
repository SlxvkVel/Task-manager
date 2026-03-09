import { TaskManager } from '../src/models/TaskManager.js';

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    localStorage.clear();
    taskManager = new TaskManager();
  });

  test('должен добавлять задачу и сохранять в localStorage', () => {
    taskManager.addTask({ title: 'Test task' });
    expect(taskManager.tasks.length).toBe(1);
    const saved = JSON.parse(localStorage.getItem('tasks'));
    expect(saved.length).toBe(1);
    expect(saved[0].title).toBe('Test task');
  });

  test('должен удалять задачу по id', () => {
    const task = taskManager.addTask({ title: 'To delete' });
    taskManager.deleteTask(task.id);
    expect(taskManager.tasks.length).toBe(0);
    const saved = JSON.parse(localStorage.getItem('tasks'));
    expect(saved.length).toBe(0);
  });

  test('должен переключать статус выполнения', () => {
    const task = taskManager.addTask({ title: 'Toggle me' });
    expect(task.completed).toBe(false);
    taskManager.toggleComplete(task.id);
    expect(taskManager.tasks[0].completed).toBe(true);
    const saved = JSON.parse(localStorage.getItem('tasks'));
    expect(saved[0].completed).toBe(true);
  });

  test('должен возвращать отфильтрованные задачи', () => {
    taskManager.addTask({ title: 'Active 1' });
    const task2 = taskManager.addTask({ title: 'Active 2' });
    taskManager.toggleComplete(task2.id);
    const all = taskManager.getFilteredTasks('all');
    expect(all.length).toBe(2);
    const active = taskManager.getFilteredTasks('active');
    expect(active.length).toBe(1);
    const completed = taskManager.getFilteredTasks('completed');
    expect(completed.length).toBe(1);
  });

  test('должен возвращать задачи на сегодня', () => {
    const today = new Date().toISOString().slice(0,10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
    taskManager.addTask({ title: 'Today task', dueDate: today + 'T10:00' });
    taskManager.addTask({ title: 'Tomorrow task', dueDate: tomorrow + 'T10:00' });
    const dueToday = taskManager.getTasksDueToday();
    expect(dueToday.length).toBe(1);
    expect(dueToday[0].title).toBe('Today task');
  });
});