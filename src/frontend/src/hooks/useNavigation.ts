import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth";
import {
	MAIN_NAVIGATION,
	USER_NAVIGATION,
	ADMIN_NAVIGATION,
} from "@/constants/navigation";
import type { NavigationItem } from "@/constants/navigation";

export function useNavigation() {
	const pathname = usePathname();
	const { isAuthenticated, user } = useAuthStore();

	const filteredNavigation = useMemo(() => {
		const filterByAuth = (items: NavigationItem[]) =>
			items.filter((item) => {
				if (item.requiresAuth && !isAuthenticated) return false;
				if (item.adminOnly && user?.permissionLevel !== "administrator")
					return false; // Assuming role field exists
				return true;
			});

		return {
			main: filterByAuth(MAIN_NAVIGATION),
			user: filterByAuth(USER_NAVIGATION),
			admin: filterByAuth(ADMIN_NAVIGATION),
		};
	}, [isAuthenticated, user]);

	const activeItem = useMemo(() => {
		const allItems = [
			...filteredNavigation.main,
			...filteredNavigation.user,
			...filteredNavigation.admin,
		];
		return allItems.find((item) => pathname.startsWith(item.href));
	}, [pathname, filteredNavigation]);

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return {
		navigation: filteredNavigation,
		activeItem,
		isActive,
		pathname,
	};
}
