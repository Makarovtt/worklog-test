import { Result, Button } from 'antd';
import { Component, type PropsWithChildren, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    console.error('Необработанная ошибка приложения:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Произошла ошибка"
          subTitle={this.state.error?.message ?? 'Неизвестная ошибка'}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Перезагрузить страницу
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
