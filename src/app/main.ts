import { TodoApp } from '../features/TodoApp';
import { TodoStorage } from '../services/TodoStorage';
import { TodoRenderer } from '../features/TodoRenderer';
import { TodoNotifications } from '../features/TodoNotifications';
import { TodoTheme } from '../features/TodoTheme';

document.addEventListener('DOMContentLoaded', () => {
  const app = new TodoApp(
    new TodoStorage(),
    new TodoRenderer(),
    new TodoNotifications(),
    new TodoTheme()
  );
  app.init();
});


