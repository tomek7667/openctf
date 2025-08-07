"use client";

import React from "react";
import { clsx } from "clsx";
import { ChevronDown } from "@/components/icons";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	options: Array<{ value: string; label: string }>;
	placeholder?: string;
}

export function Select({
	label,
	error,
	options,
	placeholder = "Select an option",
	className,
	...props
}: SelectProps) {
	return (
		<div className="space-y-2">
			{label && (
				<label className="text-sm font-medium leading-none">{label}</label>
			)}
			<div className="relative">
				<select
					className={clsx(
						"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
						error && "border-destructive",
						className
					)}
					{...props}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
			</div>
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
