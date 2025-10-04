class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.currentTheme = localStorage.getItem('theme') || 'green';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Добавление задачи
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Очистка выполненных
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());

        // Переключение темы
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Обновляем иконку темы
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = '⭐';
    }

    toggleTheme() {
    const newTheme = this.currentTheme === 'green' ? 'blue' : 'green';
    this.showThemeNotification(newTheme);
    this.setTheme(newTheme);
    }

    showThemeNotification(newTheme) {
    // Создаем уведомление с правильными цветами для новой темы
    const notification = document.createElement('div');
    
    // Сначала применяем тему
    const isGreen = newTheme === 'green';
    notification.className = `notification notification-info theme-notification`;
    
    // Устанавливаем текст
    notification.textContent = `Тема изменена на ${isGreen ? 'зеленую' : 'синюю'}!`;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Принудительно устанавливаем стили после добавления в DOM
    setTimeout(() => {
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${isGreen ? '#001100' : '#000833'};
            color: ${isGreen ? '#00ff00' : '#0088ff'};
            border: 1px solid ${isGreen ? '#00ff00' : '#0088ff'};
            border-radius: 0;
            box-shadow: ${isGreen ? '0 0 10px #00ff00' : '0 0 10px #0088ff'};
            z-index: 1000;
            animation: terminalIn 0.3s ease;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            min-width: 250px;
            text-align: center;
            white-space: nowrap;
            box-sizing: border-box;
        `;
    }, 10);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'terminalOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (text === '') {
            this.showNotification('Введите текст задачи!', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        input.value = '';
        this.save();
        this.render();
        this.showNotification('Задача добавлена!', 'success');
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
        this.render();
        this.showNotification('Задача удалена!', 'info');
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.save();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.render();
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) {
            this.showNotification('Нет выполненных задач для удаления!', 'info');
            return;
        }

        if (confirm(`Удалить ${completedCount} выполненных задач?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.save();
            this.render();
            this.showNotification('Выполненные задачи удалены!', 'success');
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const taskCount = document.getElementById('taskCount');
        const filteredTasks = this.getFilteredTasks();

        // Обновляем счетчик
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        taskCount.textContent = `Всего: ${totalTasks} | Выполнено: ${completedTasks}`;

        // Рендерим задачи
        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="delete-btn" title="Удалить">🗑️</button>
            </div>
        `;

        // События
        li.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});