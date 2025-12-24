export type Theme = 'green' | 'blue';

export class TodoTheme {
  private current: Theme = (localStorage.getItem('theme') as Theme) || 'green';

  apply(theme: Theme) {
    this.current = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggle(): Theme {
    return this.current === 'green' ? 'blue' : 'green';
  }

  getCurrent(): Theme {
    return this.current;
  }
}


