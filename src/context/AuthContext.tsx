import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, type User } from '../lib/db';

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (username: string, pin: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'splitbill_session';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Query all users for login verification
    const { data, isLoading: queryLoading } = db.useQuery({ users: {} });

    useEffect(() => {
        // Check for existing session
        const savedSession = localStorage.getItem(SESSION_KEY);
        if (savedSession && data?.users) {
            const { username } = JSON.parse(savedSession);
            const user = data.users.find((u) => u.username === username);
            if (user) {
                setCurrentUser(user as User);
            }
        }
        if (!queryLoading) {
            setIsLoading(false);
        }
    }, [data, queryLoading]);

    const login = async (username: string, pin: string): Promise<boolean> => {
        if (!data?.users) return false;

        const user = data.users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin
        );

        if (user) {
            setCurrentUser(user as User);
            localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
