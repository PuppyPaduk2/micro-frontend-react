import React, { Component, ErrorInfo, PropsWithChildren, ReactChild } from 'react';

type Props = PropsWithChildren<{
  title?: ReactChild;
}>;

type State = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <div style={{ color: 'red' }}>{this.props.title ?? "Error"}</div>
          <div style={{ color: 'red' }}>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state?.error && this.state?.error.toString()}
              <br />
              {this.state?.errorInfo?.componentStack}
            </details>
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}
