import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ExclamationOctagon, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { Button } from '@/components/ui/Button';

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
    console.error('Erreur interceptée par ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 text-left"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ExclamationOctagon className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold text-slate-900 m-0">Une erreur est survenue</h1>
              <p className="text-xs text-slate-500">
                Vos données sont enregistrées. Veuillez actualiser la page.
              </p>
            </div>

            {this.state.error && (
              <pre className="p-3 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-700 overflow-x-auto max-h-32 border border-slate-200">
                {this.state.error.message}
              </pre>
            )}

            <div className="pt-2">
              <Button
                variant="gold"
                size="md"
                className="w-full"
                leftIcon={<ArrowCounterclockwise className="w-4 h-4" />}
                onClick={this.handleReset}
              >
                Actualiser la page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
