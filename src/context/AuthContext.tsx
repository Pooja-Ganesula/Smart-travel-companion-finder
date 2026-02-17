/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { currentUserMock } from '../data/mockUsers';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    updateProfile: (profile: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('tcf_user');
        if (!stored) return null;

        try {
            return JSON.parse(stored) as User;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('tcf_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('tcf_user');
        }
    }, [user]);

    const login = (email: string, password: string): boolean => {
        if (!email || !password) {
            return false;
        }

        // Mock auth validation
        if (email.toLowerCase() !== currentUserMock.email || password !== 'password123') {
            return false;
        }

        setUser(currentUserMock);
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (updates: Partial<User>) => {
        if (user) {
            setUser({
                ...user,
                ...updates,
                profile: {
                    ...user.profile,
                    ...updates.profile,
                },
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
