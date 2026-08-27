import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/user";

interface UserCOntextType {
    user : User | null;
    loading : boolean;
    register : (userInfo : registerUser) => Promise<{status:number, message:string}>;
    logIn : (credentials : {email : string; password : string;}) => Promise<{stat : number, msg : string}>;
    logOut : () => void;
    userProfile : () => User | null;
    fetchHelper : (url: string, options ?: RequestInit) => Promise<Response>;
}

interface logInProps {
    email : string;
    password : string;
}

interface registerUser {
    firstName : string;
    lastName: string;
    email: string;
    password : string;
}

const UserContext = createContext<UserCOntextType | undefined>(undefined);

export function UserProvider({children} : {children : ReactNode}) {

    // const {refreshMovements} = useMovements();
    // const {loadWorkouts} = useWorkouts();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    function fetchHelper(url: string, options : RequestInit = {}) : Promise<Response> {
        const token = localStorage.getItem("token");
        const headers = new Headers(options.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`); 
        }

        return fetch(url, {...options, headers,});
    }

    async function checkUser() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:3000/api/profile", {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                setUser(result);
            } else {
                localStorage.removeItem("token");
            }
        } catch(err){
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function register(userInfo : registerUser) {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/Users", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
            localStorage.setItem("token", result.token);
            setUser(result);
            return {status: 200, message: "suceessful"};
        } else {
            return {status : response.status, message: result.message};
        }
        } catch(err) {
            console.log(err);
            return {status: 500, message: err};
        } finally {
            setLoading(false);
        }
    }

    /**
     * 
     * @param credentials 
     * @return 
     */
    async function logIn(credentials : logInProps) {
        try {
            setLoading(true);
            const {email, password} = credentials;
            const response = await fetch("http://localhost:3000/api/LogIn", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            })
            const result = await response.json();

            const stat = response.status as number; 
            const msg = result.message;

            if (response.ok) {
                localStorage.setItem("token", result.token);
                setUser(result.user);
            }
            return {stat, msg};
            
        } catch(err) {
            const msg = err as string;
            const stat = 500;
            console.log(err);
            return {stat, msg};
        } finally {
            setLoading(false);
        }
    }

    function logOut() {
        localStorage.removeItem("token");
        console.log(localStorage.getItem("token"));
        setUser(null);
        // refreshMovements;
        // loadWorkouts;
    }

    function userProfile() {
        return user;
    }

    return (
        <UserContext.Provider value={{
            user,
            loading,
            register,
            logIn,
            logOut,
            userProfile,
            fetchHelper
        }}>{children}</UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("Failed");
    }

    return context;
}