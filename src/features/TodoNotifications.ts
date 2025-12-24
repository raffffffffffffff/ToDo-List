export type NotifyType = 'success' | 'error' | 'info';

export class TodoNotifications {
  show(message: string, type: NotifyType = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = message;
    document.body.appendChild(n);

    setTimeout(() => {
      n.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => n.remove(), 300);
    }, 3000);
  }
}



