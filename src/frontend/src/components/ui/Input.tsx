"use client";

import React from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: undefined | string;
	error?: undefined | string;
	multiline?: boolean;
	rows?: number;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: undefined | string;
	error?: undefined | string;
	multiline: true;
}

export function Input({ label, error, className, multiline, rows, ...props }: InputProps | TextAreaProps) {
	const baseClasses = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	return (
		<div className="space-y-2">
			{label && (
				<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					{label}
				</label>
			)}
			{multiline ? (
				<textarea
					className={clsx(
						baseClasses,
						"min-h-[80px] resize-vertical",
						error && "border-destructive",
						className
					)}
					rows={rows || 3}
					{...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
				/>
			) : (
				<input
					className={clsx(
						baseClasses,
						"h-10",
						error && "border-destructive",
						className
					)}
					{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
				/>
			)}
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
