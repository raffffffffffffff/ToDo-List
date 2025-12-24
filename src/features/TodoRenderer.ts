import { Task } from '../models/Task';

export class TodoRenderer {
  private list: HTMLElement;
  private empty: HTMLElement;
  private counter: HTMLElement;

  constructor() {
    this.list = document.getElementById('taskList')!;
    this.empty = document.getElementById('emptyState')!;
    this.counter = document.getElementById('taskCount')!;
  }

  render(
    tasks: Task[],
    total: number,
    completed: number,
    onToggle: (id:number)=>void,
    onDelete: (id:number)=>void
  ) {
    this.counter.textContent = `Всего: ${total} | Выполнено: ${completed}`;
    this.list.innerHTML = '';

    if (!tasks.length) {
      this.empty.classList.add('show');
      return;
    }
    this.empty.classList.remove('show');

    tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = `task-item ${t.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}>
        <span>${t.text}</span>
        <button class="delete-btn">🗑️</button>
      `;
      li.querySelector('.task-checkbox')!.addEventListener('change', () => onToggle(t.id));
      li.querySelector('.delete-btn')!.addEventListener('click', () => onDelete(t.id));
      this.list.appendChild(li);
    });
  }
}



