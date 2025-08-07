"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	defaultView?: undefined | "login" | "register";
}

export function AuthModal({
	isOpen,
	onClose,
	defaultView = "login",
}: AuthModalProps) {
	const [currentView, setCurrentView] = useState<"login" | "register">(
		defaultView
	);

	const handleSuccess = () => {
		onClose();
		setCurrentView("login"); // Reset to login for next time
	};

	const switchToLogin = () => setCurrentView("login");
	const switchToRegister = () => setCurrentView("register");

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm">
			<div className="flex justify-center">
				{currentView === "login" ? (
					<LoginForm
						onSuccess={handleSuccess}
						onSwitchToRegister={switchToRegister}
					/>
				) : (
					<RegisterForm
						onSuccess={handleSuccess}
						onSwitchToLogin={switchToLogin}
					/>
				)}
			</div>
		</Modal>
	);
}
