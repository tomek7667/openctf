"use client";

import { ChevronLeft } from "@/components/icons";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

export const GoBack = ({ err }: { err?: string }) => {
	return (
		<div className="min-h-screen bg-background matrix-bg">
			<Header />
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">{err ?? "Team Not Found"}</h1>
					<Button onClick={() => window.history.back()}>
						<ChevronLeft className="h-4 w-4 mr-2" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
};
