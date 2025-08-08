import { useAuthStore } from '@/store/authStore';
import { login, register, logout } from '@/api/auth';
import type { LoginDto, RegisterDto } from '@/types/api';

export function useAuth() {
	const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

	const handleLogin = async (credentials: LoginDto) => {
		setLoading(true);
		try {
			const response = await login(credentials);
			setAuth(response.user, response.token);
			return response;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (userData: RegisterDto) => {
		setLoading(true);
		try {
			const response = await register(userData);
			setAuth(response.user, response.token);
			return response;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		setLoading(true);
		try {
			await logout();
			clearAuth();
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			setLoading(false);
		}
	};

	return {
		user,
		token,
		isAuthenticated,
		isLoading,
		login: handleLogin,
		register: handleRegister,
		logout: handleLogout,
	};
}