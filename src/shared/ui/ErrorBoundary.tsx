import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      'Unhandled UI Exception caught by ErrorBoundary:',
      error,
      errorInfo,
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Result
            status="error"
            title="Đã xảy ra sự cố giao diện"
            subTitle={
              this.state.error?.message ||
              'Hệ thống gặp lỗi không mong muốn. Vui lòng tải lại trang hoặc liên hệ quản trị viên.'
            }
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReset}>
                Tải lại trang
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
