import { User, UserRole } from "@/types"
import { createContext, useContext, useMemo, useState } from "react"

const UserContext = createContext<User | null>(null);
const ToggleUserContext = createContext<(() => void) | null>(null)

interface IUserProviderProps {
    children: React.ReactNode;
}

export default function UserProvider(props: IUserProviderProps) {
    const student = useMemo<User>(() => ({
        id: 1,
        first_name: "Talha Burak",
        last_name: "Onat",
        date_joined: "2021-09-01T00:00:00Z",
        email: "tburakonat@gmail.com",
        password: "password",
    }), []);

    const teacher = useMemo<User>(() => ({
        id: 2,
        first_name: "John",
        last_name: "Doe",
        date_joined: "2021-09-01",
        email: "john.doe@gmail.com",
        password: "password",
    }), []);

    const [user, setUser] = useState<User>(student);

    const toggleRole = () => {
        if (user?.id === 1) {
            setUser(teacher)
            return
        } else {
            setUser(student)
            return
        }
    }

    return (
        <UserContext.Provider value={user}>
            <ToggleUserContext.Provider value={toggleRole}>
                {props.children}
            </ToggleUserContext.Provider>
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);

export const useToggleUser = () => useContext(ToggleUserContext);