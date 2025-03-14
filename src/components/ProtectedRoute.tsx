import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Interface som definierar props för ProtectedRoute där "children" är det skyddade innehållet.
interface ProtectedRouteProps {
    children: ReactNode
}

// Komponent som säkrar skyddade resurser.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    // Hämtar in nuvarande användare från autentiseringscontextet.
    const { user } = useAuth();

    // Kontrollerar om en användare faktiskt är inloggad. Annars omdirigering till inloggningssidan.
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Om en användare är inloggad, renderas det skyddade innehållet.
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute