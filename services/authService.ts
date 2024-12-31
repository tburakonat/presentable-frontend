import { User } from "@/types";

const authService = {
    async login(username: string, password: string) {
        const response = await fetch("/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.status !== 200) {
            throw new Error("Login failed");
		}

        const data: User = await response.json();

        if (!data.id) {
            throw new Error("Login failed");
        } else {
            return data;
        }
    },
    async logout() {
        return fetch("/api/token/logout/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }); 
    },
    async checkAuthStatus() {
        const response = await fetch("/api/token/verify/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data: User = await response.json();

        if (!data.id) {
            return null;
        } else {
            return data;
        }
    }
};

export default authService;