import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check registry
                const registry = JSON.parse(localStorage.getItem('app_users_registry') || '[]');
                const user = registry.find(u => u.email === email && u.password === password);

                if (user) {
                    const sessionUser = { ...user };
                    delete sessionUser.password; // Don't keep password in session
                    setUser(sessionUser);
                    localStorage.setItem('user', JSON.stringify(sessionUser));
                    resolve(sessionUser);
                } else if (email === 'manager@example.com' && password === 'password') {
                    // Fallback for demo manager
                    const userData = {
                        id: '1',
                        email,
                        full_name: 'Assignee Manager',
                        role: 'manager',
                        team_id: 'team_demo',
                        invite_code: 'DEMO-123',
                        avatar: null
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    };

    const register = (email, password, fullName, role, inviteCode) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const registry = JSON.parse(localStorage.getItem('app_users_registry') || '[]');

                if (registry.find(u => u.email === email)) {
                    reject(new Error("Email already exists"));
                    return;
                }

                let teamId, teamCode;

                if (inviteCode) {
                    // Find team by invite code
                    const teamOwner = registry.find(u => u.invite_code === inviteCode);
                    if (teamOwner) {
                        teamId = teamOwner.team_id;
                        teamCode = teamOwner.invite_code;
                    } else {
                        reject(new Error("Invalid Invite Code"));
                        return;
                    }
                } else {
                    // Create new team
                    teamId = 'team_' + Math.random().toString(36).substr(2, 9);
                    teamCode = 'INV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                }

                const newUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    email,
                    password, // In real app, hash this!
                    full_name: fullName,
                    role: role || 'member',
                    team_id: teamId,
                    invite_code: teamCode,
                    avatar: null
                };

                registry.push(newUser);
                localStorage.setItem('app_users_registry', JSON.stringify(registry));

                const sessionUser = { ...newUser };
                delete sessionUser.password;

                setUser(sessionUser);
                localStorage.setItem('user', JSON.stringify(sessionUser));
                resolve(sessionUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const loginAsGuest = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData = {
                    id: 'guest_' + Math.random().toString(36).substr(2, 9),
                    email: 'guest@codehustlers.dev',
                    full_name: 'Guest User',
                    role: 'guest',
                    avatar: null
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                resolve(userData);
            }, 500);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAsGuest, register, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
