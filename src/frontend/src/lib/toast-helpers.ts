import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "./utils";

/**
 * Toast helper functions for common scenarios
 */

/**
 * Hook for easy access to toast helpers
 */
export const useToastHelpers = () => {
	const { toast } = useToast();

	return {
		apiSuccess: (operation: string, details?: undefined | string) => {
			toast.success(
				`${operation} successful`,
				details || `Operation completed successfully`,
				5000
			);
		},
		apiError: (operation: string, error: unknown) => {
			const message = getErrorMessage(error);
			toast.error(`${operation} failed`, message, 7000);
		},
		networkError: () => {
			toast.error(
				"Network connection error",
				"Please check your internet connection and try again.",
				10000
			);
		},
	};
};

export default useToastHelpers;
