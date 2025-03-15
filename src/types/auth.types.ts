// Interface som definierar användaren.
export interface User {
    id: string,
    username: string
}

// Interface för nödvändiga uppgifter vid inloggning.
export interface LoginCredentials {
    username: string,
    password: string
}

// Interface för svar vid lyckad inloggning. Användaruppgifter och autentiseringstoken.
export interface AuthResponse {
    user: User,
    token: string
}

// Interface som definierar authContext-strukturen. Tillhandahåller användaruppgifter och auth-funktioner.
export interface AuthContextType {
    user: User | null,
    register: (credentials: LoginCredentials) => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}