import { Task } from '../models/Task';

export class TodoStorage {
  private readonly key = 'tasks';

  load(): Task[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  save(tasks: Task[]): void {
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }
}

