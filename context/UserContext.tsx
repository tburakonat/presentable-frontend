import { User, UserRole } from "@/types"
import { createContext, useContext, useMemo, useState } from "react"

const UserContext = createContext<User | null>(null);
const ToggleUserContext = createContext<(() => void) | null>(null)

interface IUserProviderProps {
    children: React.ReactNode;
}

export default function UserProvider(props: IUserProviderProps) {
    const student = useMemo(() => ({
        id: "1",
        firstName: "Talha Burak",
        lastName: "Onat",
        role: UserRole.STUDENT,
    }), []);

    const teacher = useMemo(() => ({
        id: "2",
        firstName: "Hendrik",
        lastName: "Drachsler",
        role: UserRole.TEACHER,
    }), []);

    const [user, setUser] = useState<User>(student);

    const toggleRole = () => {
        if (user?.role === UserRole.STUDENT) {
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