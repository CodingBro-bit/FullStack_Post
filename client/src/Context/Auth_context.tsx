import React, { createContext, useContext, useState } from "react";


interface AuthProps {
    isAuth : boolean , 
    login : () => void , 
    logout : () => void,
}

export const AuthContext = createContext<AuthProps | undefined>(undefined)

export const AuthProvider : React.FC<{children:React.ReactNode}> = ({children}) => {
    const [isAuth , setIsAuth] = useState<boolean>(false);

    const login = () => setIsAuth(true);
    const logout = () => setIsAuth(false);

    return(
        <AuthContext.Provider value={{isAuth , login , logout}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};