"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	CheckCircle,
	AlertCircle,
	AlertTriangle,
	Info,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: undefined | string;
	duration?: undefined | number;
	action:
		| undefined
		| {
				label: string;
				onClick: () => void;
		  };
}

interface ToastComponentProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

const ToastComponent = ({ toast, onRemove }: ToastComponentProps) => {
	const [isVisible, setIsVisible] = useState(true);
	const [progress, setProgress] = useState(100);

	const duration = toast.duration || 5000;

	useEffect(() => {
		if (duration === Infinity) return;

		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const remaining = Math.max(0, duration - elapsed);
			setProgress((remaining / duration) * 100);

			if (remaining <= 0) {
				setIsVisible(false);
				setTimeout(() => onRemove(toast.id), 300);
				clearInterval(interval);
			}
		}, 50);

		return () => clearInterval(interval);
	}, [duration, toast.id, onRemove]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onRemove(toast.id), 300);
	};

	const getIcon = () => {
		switch (toast.type) {
			case "success":
				return <CheckCircle className="h-5 w-5 text-green-400" />;
			case "error":
				return <AlertCircle className="h-5 w-5 text-red-400" />;
			case "warning":
				return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
			case "info":
				return <Info className="h-5 w-5 text-blue-400" />;
			default:
				return <Info className="h-5 w-5 text-primary" />;
		}
	};

	const getThemeClasses = () => {
		switch (toast.type) {
			case "success":
				return "border-green-400/50 shadow-green-400/20";
			case "error":
				return "border-red-400/50 shadow-red-400/20";
			case "warning":
				return "border-yellow-400/50 shadow-yellow-400/20";
			case "info":
				return "border-blue-400/50 shadow-blue-400/20";
			default:
				return "border-primary/50 shadow-primary/20";
		}
	};

	const getProgressColor = () => {
		switch (toast.type) {
			case "success":
				return "bg-green-400";
			case "error":
				return "bg-red-400";
			case "warning":
				return "bg-yellow-400";
			case "info":
				return "bg-blue-400";
			default:
				return "bg-primary";
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, x: 300, scale: 0.3 }}
					animate={{ opacity: 1, x: 0, scale: 1 }}
					exit={{ opacity: 0, x: 300, scale: 0.5 }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
					className={cn(
						"relative min-w-[300px] max-w-[400px] p-4 bg-black/90 backdrop-blur-sm border rounded-none font-mono shadow-2xl",
						getThemeClasses()
					)}
					style={{
						boxShadow: `0 0 20px ${
							toast.type === "success"
								? "rgba(74, 222, 128, 0.2)"
								: toast.type === "error"
									? "rgba(248, 113, 113, 0.2)"
									: toast.type === "warning"
										? "rgba(251, 191, 36, 0.2)"
										: toast.type === "info"
											? "rgba(96, 165, 250, 0.2)"
											: "rgba(0, 255, 255, 0.2)"
						}`,
					}}
				>
					{/* Progress bar */}
					{duration !== Infinity && (
						<div className="absolute top-0 left-0 right-0 h-[2px] bg-muted/20">
							<div
								className={cn(
									"h-full transition-all duration-75 ease-linear",
									getProgressColor()
								)}
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}

					<div className="flex items-start space-x-3">
						{/* Icon */}
						<div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-bold text-foreground mb-1">
										<span className="text-primary">&gt; </span>
										{toast.title.toUpperCase()}
									</p>
									{toast.message && (
										<p className="text-xs text-muted-foreground leading-relaxed">
											{toast.message}
										</p>
									)}
								</div>

								{/* Close button */}
								<button
									onClick={handleClose}
									className="flex-shrink-0 ml-2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-none hover:bg-muted/20"
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							{/* Action button */}
							{toast.action && (
								<div className="mt-3">
									<button
										onClick={toast.action.onClick}
										className="text-xs font-bold text-primary hover:text-primary/80 transition-colors border-b border-primary/30 hover:border-primary/60"
									>
										[{toast.action.label.toUpperCase()}]
									</button>
								</div>
							)}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ToastComponent;
