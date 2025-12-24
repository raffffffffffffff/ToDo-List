import { Task } from '../models/Task';
import { TodoStorage } from '../services/TodoStorage';
import { TodoRenderer } from './TodoRenderer';
import { TodoNotifications } from './TodoNotifications';
import { TodoFilters, FilterType } from './TodoFilters';
import { TodoTheme, Theme } from './TodoTheme';

export class TodoApp {
  private tasks: Task[] = [];
  private filter: FilterType = 'all';

  constructor(
    private storage: TodoStorage,
    private renderer: TodoRenderer,
    private notifier: TodoNotifications,
    private theme: TodoTheme
  ) {
    this.tasks = this.storage.load();
  }

  init(): void {
    this.theme.apply(this.theme.getCurrent());
    this.bind();
    this.render();
  }

  private bind(): void {
    const input = document.getElementById('taskInput') as HTMLInputElement;
    const addBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clearCompleted') as HTMLButtonElement;
    const themeBtn = document.getElementById('themeToggle') as HTMLButtonElement;

    addBtn.addEventListener('click', () => this.add(input.value));
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.add(input.value); });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') as FilterType;
        this.setFilter(filter);
      });
    });

    clearBtn.addEventListener('click', () => this.clearCompleted());
    themeBtn.addEventListener('click', () => this.toggleTheme());
  }

  private add(text: string): void {
    if (!text.trim()) {
      this.notifier.show('Введите текст задачи!', 'error');
      return;
    }

    this.tasks.unshift({
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    });

    this.save();
    this.render();
    this.notifier.show('Задача добавлена!', 'success');
  }

  private toggle(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.save();
    this.render();
  }

  private delete(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.render();
    this.notifier.show('Задача удалена!', 'info');
  }

  private setFilter(filter: FilterType): void {
    this.filter = filter;
    this.render();
  }

  private clearCompleted(): void {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (!completedCount) {
      this.notifier.show('Нет выполненных задач для удаления!', 'info');
      return;
    }

    if (confirm(`Удалить ${completedCount} выполненных задач?`)) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.save();
      this.render();
      this.notifier.show('Выполненные задачи удалены!', 'success');
    }
  }

  private toggleTheme(): void {
    const newTheme: Theme = this.theme.toggle();
    this.theme.apply(newTheme);
  }

  private render(): void {
    const filtered = new TodoFilters(this.tasks).apply(this.filter);
    this.renderer.render(
      filtered,
      this.tasks.length,
      this.tasks.filter(t => t.completed).length,
      id => this.toggle(id),
      id => this.delete(id)
    );
  }

  private save(): void {
    this.storage.save(this.tasks);
  }
}


