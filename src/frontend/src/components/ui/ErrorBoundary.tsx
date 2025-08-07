/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "@/components/ui/icons";

interface Props {
	children: ReactNode;
	fallback?: undefined | React.ComponentType<ErrorFallbackProps>;
	onError?: (error: Error, errorInfo: ErrorInfo) => void | undefined;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

interface ErrorFallbackProps {
	error: Error | null;
	errorInfo: ErrorInfo | null;
	resetError: () => void;
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
	const isDevelopment = process.env.NODE_ENV === "development";

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-6 text-center">
				<div className="space-y-2">
					<div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
						<AlertTriangle className="w-8 h-8 text-destructive" />
					</div>
					<h1 className="text-2xl font-bold text-foreground">
						Something went wrong
					</h1>
					<p className="text-muted-foreground">
						We&apos;re sorry, but an unexpected error occurred. Please try
						refreshing the page or contact support if the problem persists.
					</p>
				</div>

				{isDevelopment && error && (
					<details className="text-left bg-muted p-4 rounded-lg">
						<summary className="cursor-pointer font-medium mb-2">
							Error Details (Development)
						</summary>
						<div className="space-y-2 text-sm text-muted-foreground">
							<div>
								<strong>Error:</strong> {error.message}
							</div>
							{error.stack && (
								<div>
									<strong>Stack Trace:</strong>
									<pre className="whitespace-pre-wrap text-xs mt-1 p-2 bg-background rounded">
										{error.stack}
									</pre>
								</div>
							)}
						</div>
					</details>
				)}

				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={resetError}
						className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Try Again
					</button>
					<button
						onClick={() => (window.location.href = "/")}
						className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
					>
						<Home className="w-4 h-4 mr-2" />
						Go Home
					</button>
				</div>

				<p className="text-xs text-muted-foreground">
					Error ID: {Date.now().toString(36)}
				</p>
			</div>
		</div>
	);
}

/**
 * Error Boundary Class Component
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({
			error,
			errorInfo,
		});

		// Log error to external service in production
		if (process.env.NODE_ENV === "production") {
			this.logErrorToService(error, errorInfo);
		}

		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Log to console in development
		if (process.env.NODE_ENV === "development") {
			console.error("Error caught by boundary:", error);
			console.error("Error info:", errorInfo);
		}
	}

	private logErrorToService(error: Error, errorInfo: ErrorInfo) {
		// In a real application, you would send this to a service like Sentry
		const errorData = {
			message: error.message,
			stack: error.stack,
			componentStack: errorInfo.componentStack,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
		};

		// Example: Send to error reporting service
		// errorReportingService.captureException(errorData)

		console.error("Error logged to service:", errorData);
	}

	resetError = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render() {
		if (this.state.hasError) {
			const FallbackComponent = this.props.fallback || DefaultErrorFallback;

			return (
				<FallbackComponent
					error={this.state.error}
					errorInfo={this.state.errorInfo}
					resetError={this.resetError}
				/>
			);
		}

		return this.props.children;
	}
}

/**
 * Hook for error boundary functionality in functional components
 */
export function useErrorHandler() {
	return (error: Error, errorInfo?: undefined | ErrorInfo) => {
		if (process.env.NODE_ENV === "development") {
			console.error("Error handled:", error);
			if (errorInfo) {
				console.error("Error info:", errorInfo);
			}
		}

		// Throw error to be caught by nearest error boundary
		throw error;
	};
}

export default ErrorBoundary;
