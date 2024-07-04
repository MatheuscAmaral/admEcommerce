import { ReactNode, createContext, useState } from "react";

interface AuthProps {
    user: UserDataProps[],
    authUser: (user: UserDataProps[]) => void
    logout: () => void
}

interface UserDataProps {
    name: string,
    user: string,
    email: string,
    nivel: number,
    status: number
}

interface AuthProvider {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthProps);


const AuthProvider = ({children}: AuthProvider) => {
    const [user, setUser] = useState<UserDataProps[]>([]);
    
    const authUser = (user: UserDataProps[]) => {
        setUser([...user]);
        localStorage.setItem("@userAdmEcommerce", JSON.stringify([...user]));
    }

    const logout = () => {
        setUser([]);
        localStorage.removeItem("@userAdmEcommerce");
    }

    return (
        <AuthContext.Provider value={{user, authUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;