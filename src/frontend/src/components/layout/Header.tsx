"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Menu,
	X,
	Trophy,
	Shield,
	Users,
	User,
	BookOpen,
	LogIn,
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";

const navigation = [
	{
		id: "teams",
		label: "Teams",
		href: "/teams",
		icon: Users,
	},
	{
		id: "users",
		label: "Users",
		href: "/users",
		icon: User,
	},
	{
		id: "contests",
		label: "Contests",
		href: "/contests",
		icon: Trophy,
	},
	{
		id: "writeups",
		label: "Writeups",
		href: "/writeups",
		icon: BookOpen,
	},
	{
		id: "weight-pool",
		label: "Weight Pool",
		href: "/weight-pool",
		icon: Shield,
	},
];

export function Header() {
	const qp = new URL(window.location.href).searchParams;
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(
		qp.get("authModal") === "true"
	);
	const { isAuthenticated } = useAuthStore();

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header
			className="sticky top-0 z-50 w-full border-b border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			style={{
				zIndex: 9999,
			}}
		>
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 min-w-0">
						<div className="h-8 w-8 rounded-none bg-primary glow-text flex items-center justify-center text-black font-bold flex-shrink-0">
							[O]
						</div>
						<span className="text-xl font-bold font-mono glow-text whitespace-nowrap">
							<span className="hidden sm:inline">&gt; </span>OpenCTF
						</span>
					</Link>

					<div className="hidden md:flex items-center space-x-6">
						<nav className="flex items-center space-x-6">
							{navigation.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.id}
										href={item.href}
										className={`flex items-center space-x-2 px-3 py-2 rounded-none text-sm font-bold font-mono transition-colors ${
											isActive(item.href)
												? "bg-primary text-black glow-text"
												: "text-muted-foreground hover:text-primary hover:bg-accent/50"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>[{item.label.toUpperCase()}]</span>
									</Link>
								);
							})}
						</nav>

						{isAuthenticated ? (
							<UserMenu />
						) : (
							<button
								onClick={() => setAuthModalOpen(true)}
								className="flex items-center space-x-2 px-3 py-2 rounded-none text-sm font-bold font-mono transition-colors text-muted-foreground hover:text-primary hover:bg-accent/50"
							>
								<LogIn className="h-4 w-4" />
								<span>[LOGIN]</span>
							</button>
						)}
					</div>

					<button
						onClick={toggleMobileMenu}
						className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>

				{isMobileMenuOpen && (
					<div className="md:hidden py-4 border-t">
						<nav className="flex flex-col space-y-2">
							{navigation.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.id}
										href={item.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className={`flex items-center space-x-2 px-3 py-2 rounded-none text-sm font-bold font-mono transition-colors ${
											isActive(item.href)
												? "bg-primary text-black glow-text"
												: "text-muted-foreground hover:text-primary hover:bg-accent/50"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>[{item.label.toUpperCase()}]</span>
									</Link>
								);
							})}

							{!isAuthenticated && (
								<button
									onClick={() => {
										setAuthModalOpen(true);
										setIsMobileMenuOpen(false);
									}}
									className="flex items-center space-x-2 px-3 py-2 rounded-none text-sm font-bold font-mono transition-colors text-muted-foreground hover:text-primary hover:bg-accent/50"
								>
									<LogIn className="h-4 w-4" />
									<span>[LOGIN]</span>
								</button>
							)}
						</nav>
					</div>
				)}

				<AuthModal
					isOpen={authModalOpen}
					onClose={() => setAuthModalOpen(false)}
				/>
			</div>
		</header>
	);
}
