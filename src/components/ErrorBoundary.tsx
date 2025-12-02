import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-200">
                        <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
                        <p className="text-gray-600 mb-6">
                            Ha ocurrido un error inesperado en la aplicación.
                        </p>

                        {this.state.error && (
                            <div className="bg-gray-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-48">
                                <p className="text-red-600 font-mono text-sm font-semibold mb-2">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary flex items-center justify-center mx-auto"
                        >
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
