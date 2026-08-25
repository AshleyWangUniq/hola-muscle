import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { useMovements } from "./MovementContext";
import { useWorkouts } from "./WorkoutContext";

interface UserCOntextType {
    user : User | null;
    loading : boolean;
    register : (userInfo : registerUser) => Promise<void>;
    logIn : (credentials : {email : string; password : string;}) => Promise<void>;
    logOut : () => void;
    userProfile : () => User | null;
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
        if (response.ok) {
            localStorage.setItem("token", result.token);
            setUser(result);
        } else {
            throw new Error(result.message);
        }
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function logIn(credentials : logInProps) {
        console.log(credentials);
        const token = localStorage.getItem("token");
        console.log(token);
        try {
            setLoading(true);
            const {email, password} = credentials;
            console.log("email:", typeof email, " Password: ", typeof password);
            const response = await fetch("http://localhost:3000/api/LogIn", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }
            localStorage.setItem("token", result.token);
            setUser(result.user);
            // refreshMovements;
            // loadWorkouts;
        } catch(err) {
            console.log(err);
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
            userProfile
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