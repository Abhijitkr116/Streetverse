
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "shopease-users";
const SESSION_KEY = "shopease-user";

// Loads registered demo accounts from localStorage.
const getInitialUsers = () => {
    try {
        const savedUsers = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        return Array.isArray(savedUsers) ? savedUsers : [];
    } catch {
        return [];
    }
};

// Loads the currently logged-in demo user.
const getInitialUser = () => {
    try {
        const savedUser = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );

        return savedUser &&
            typeof savedUser.id === "string" &&
            typeof savedUser.email === "string"
            ? savedUser
            : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState(getInitialUsers);
    const [user, setUser] = useState(getInitialUser);

    // Persists registered demo accounts whenever the list changes.
    useEffect(() => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }, [users]);

    // Persists or clears the active demo session.
    useEffect(() => {
        if (user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [user]);

    // Registers a new account after checking required fields and duplicate emails.
    const register = ({ name, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!name.trim() || !normalizedEmail || !password) {
            return { success: false, message: "All fields are required." };
        }

        if (users.some((item) => item.email === normalizedEmail)) {
            return {
                success: false,
                message: "An account with this email already exists.",
            };
        }

        const newUser = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            password,
        };

        setUsers((currentUsers) => [...currentUsers, newUser]);

        // Keeps the password out of the active user session.
        setUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });

        return { success: true };
    };

    // Checks demo credentials and starts a user session.
    const login = ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        const matchedUser = users.find(
            (item) =>
                item.email === normalizedEmail &&
                item.password === password
        );

        if (!matchedUser) {
            return {
                success: false,
                message: "Invalid email or password.",
            };
        }

        setUser({
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
        });

        return { success: true };
    };

    // Ends the current demo session.
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: Boolean(user), register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Provides authentication state and methods to consuming components.
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
