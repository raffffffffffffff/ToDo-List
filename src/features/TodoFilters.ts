import { Task } from '../models/Task';

export type FilterType = 'all' | 'active' | 'completed';

export class TodoFilters {
  constructor(private tasks: Task[]) {}

  apply(filter: FilterType): Task[] {
    if (filter === 'active') return this.tasks.filter(t => !t.completed);
    if (filter === 'completed') return this.tasks.filter(t => t.completed);
    return this.tasks;
  }
}


