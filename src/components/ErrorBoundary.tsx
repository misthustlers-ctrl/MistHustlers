import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-basalt-canvas min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="font-display text-[clamp(48px,8vw,64px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink mb-4">
              Oops
            </h1>
            <p className="font-body text-lg text-abyssal-ink/60 mb-8">
              Something went wrong while navigating. This sometimes happens after using the back button.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex rounded-full bg-digital-orange px-7 py-4 text-base font-bold text-ash-white cursor-pointer transition hover:-translate-y-0.5"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
