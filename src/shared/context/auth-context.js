import { createContext } from 'react';

export const AuthContext = createContext({
    isLogeddin: false,
    userId: null,
    token: null,
    login: () => {},
    logout: () => {}
});