"use client";

import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: undefined | "primary" | "secondary" | "outline" | "destructive";
	size?: undefined | "sm" | "md" | "lg";
	children: React.ReactNode;
	asChild?: boolean;
}

export function Button({
	variant = "primary",
	size = "md",
	className,
	children,
	asChild = false,
	...props
}: ButtonProps) {
	const baseClasses = clsx(
		"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
		{
			"bg-primary text-primary-foreground hover:bg-primary/90":
				variant === "primary",
			"bg-secondary text-secondary-foreground hover:bg-secondary/80":
				variant === "secondary",
			"border border-input bg-background hover:bg-accent hover:text-accent-foreground":
				variant === "outline",
			"bg-destructive text-destructive-foreground hover:bg-destructive/90":
				variant === "destructive",
		},
		{
			"h-9 px-3 text-sm": size === "sm",
			"h-10 px-4 py-2": size === "md",
			"h-11 px-8 text-lg": size === "lg",
		},
		className
	);

	if (asChild) {
		// When asChild is true, return the children with the button classes applied
		return React.cloneElement(children as React.ReactElement, {
			className: clsx(baseClasses, (children as React.ReactElement).props.className),
		});
	}

	return (
		<button
			className={baseClasses}
			{...props}
		>
			{children}
		</button>
	);
}
