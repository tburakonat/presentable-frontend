import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

import { StorageKey, User } from "@/types";
import API, { setAuthToken } from "../helpers/api";

interface SessionContextData {
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	user: User | null;
}

interface SessionProviderProps extends PropsWithChildren {
	// provider specific props
}

const SessionContext = createContext<SessionContextData | undefined>(undefined);

export function SessionProvider({ children }: SessionProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useLocalStorage<string | undefined>(
		StorageKey.AccessToken,
		undefined
	);

	const login = async (username: string, password: string) => {
		try {
			const response = await API.session.login(username, password);
			setAccessToken(response.data.access);
			return true;
		} catch (error) {
			return false;
		}
	};

	const logout = () => {
		setAccessToken(undefined);
		setUser(null);
	};

	const verifyToken = async (token: string) => {
		try {
			await API.session.verifyToken(token);
			return true;
		} catch (error) {
			return false;
		}
	};

	const getMe = async () => {
		const response = await API.session.getMe();
		setUser(response.data);
	};

	const initializeSession = async (token: string) => {
		try {
			const isValid = await verifyToken(token);
			if (isValid) {
				setAuthToken(token);
				await getMe();
			} else {
				logout();
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!accessToken) return;
		initializeSession(accessToken);
	}, [accessToken]);

	return (
		<SessionContext.Provider value={{ login, logout, user }}>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = () => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};
