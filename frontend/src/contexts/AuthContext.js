import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(() => {
        const currentUser = authService.getLocalUser();
        if (currentUser) {
            setUser(currentUser.user); 
        }
        setLoading(false);
    }, []);

    const login = async (usernameOrEmail, password) => {
        const data = await authService.login(usernameOrEmail, password);
        setUser(data.user);
        setLoginSuccess(true);
        return data;
    };

    const loginWithToken = (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data.user);
        setLoginSuccess(true);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setLoginSuccess(false);
    };

    const updateUser = (newUser) => {
        setUser(newUser);
        const localUser = authService.getLocalUser();
        if (localUser) {
            localUser.user = newUser;
            localStorage.setItem('user', JSON.stringify(localUser));
        }
    };

    const resetLoginSuccess = () => {
        setLoginSuccess(false);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loginWithToken, loading, loginSuccess, resetLoginSuccess, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 