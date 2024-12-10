import { useUser } from "@/context/UserContext"

export default function ProfilePage() {
    const user = useUser();
    
    if (!user) {
        return <p>No user found</p>
    }
    
    return <pre>
        {JSON.stringify(user)}
    </pre>
}