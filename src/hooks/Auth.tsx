import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void; 
}

 const authContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
       const token =  localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@Gobarber:user');

if ( token && user) {
    return { token, user: JSON. parse(user) }
};

return {} as AuthState;
    });

    const signIn = useCallback(async ({email, password}) => {
        const response = await api.post('sessions', {
            email,
            password
        });
   const { token, user } = response.data;

   localStorage.setItem('@GoBarber:token', token);
   localStorage.setItem('@GoBarber:token', JSON.stringify(user));

   setData({token, user});
}, []);  

const signOut = useCallback(() => {
   localStorage.getItem('@GoBarber:token');
        localStorage.getItem('@Gobarber:user');

        setData({} as AuthState);
}, [])

    return (
        <authContext.Provider value={{user: data.user, signIn, signOut}}>
            {children}
        </authContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const context = useContext(authContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}

export { AuthProvider, useAuth} ;
