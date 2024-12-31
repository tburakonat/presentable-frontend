import { createContext, useContext, useEffect, useState } from "react";
import { StorageKey, StorageValue, User } from "@/types";
import { authService } from "@/services";

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

const AuthProvider = (props: AuthProviderProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	const login = async (username: string, password: string) => {
		try {
			const user = await authService.login(username, password);
			if (user.id) {
				setUser(user);
				setIsAuthenticated(true);
				localStorage.setItem(
					StorageKey.AuthFlag,
					StorageValue.AuthFlagTrue
				);
			}
		} catch (error) {
			console.log("Error while logging in");
		}
	};

	const logout = async () => {
		try {
			const response = await authService.logout();
			if (response.status === 200) {
				setUser(null);
				setIsAuthenticated(false);
				localStorage.removeItem(StorageKey.AuthFlag);
			}
		} catch (error) {
			console.log("Error while logging out");
		}
	};

	useEffect(() => {
		const initializeAuth = async () => {
			const authFlag = localStorage.getItem(StorageKey.AuthFlag);

			if (!authFlag) {
				setIsAuthenticated(false);
				setUser(null);
				return;
			}

			try {
				const data = await authService.checkAuthStatus();
				setIsAuthenticated(true);
				setUser(data);
			} catch (err) {
				console.log("Error while checking auth status");
				setUser(null);
				setIsAuthenticated(false);
			}
		};

		initializeAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login,
				logout,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { AuthProvider, useAuth };
