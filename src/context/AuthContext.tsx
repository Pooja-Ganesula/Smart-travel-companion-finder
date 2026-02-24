/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, TravelProfile } from '../types';
import { currentUserMock } from '../data/mockUsers';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    budgetRange?: string;
    interests?: string;
    travelStyle?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    register: (data: RegisterData) => boolean;
    logout: () => void;
    updateProfile: (profile: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const budgetMap: Record<string, TravelProfile['budget']> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

const styleMap: Record<string, TravelProfile['travelStyle']> = {
    backpacking: 'Backpacking',
    luxury: 'Luxury',
    standard: 'Standard',
    adventure: 'Adventure',
};

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

    const register = (data: RegisterData): boolean => {
        if (!data.name || !data.email || !data.password) {
            return false;
        }

        const userId = `u_${Date.now()}`;
        const interestsList = data.interests
            ? data.interests.split(',').map((s) => s.trim()).filter(Boolean)
            : [];

        const newUser: User = {
            userId,
            name: data.name,
            email: data.email.toLowerCase(),
            age: 25,
            gender: 'Other',
            verificationStatus: 'Unverified',
            bio: '',
            homeCountry: 'India',
            currentCity: '',
            profile: {
                budget: budgetMap[data.budgetRange?.toLowerCase() ?? ''] ?? 'Medium',
                travelStyle: styleMap[data.travelStyle?.toLowerCase() ?? ''] ?? 'Standard',
                interests: interestsList,
                personality: 'Ambivert',
                languagePreference: 'English',
            },
            preferences: {
                notifications: true,
                locationSharing: true,
                publicProfile: true,
            },
            stats: {
                tripsCompleted: 0,
                reviewsReceived: 0,
                averageRating: 0,
                responseRate: 0,
            },
        };

        setUser(newUser);
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
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
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
