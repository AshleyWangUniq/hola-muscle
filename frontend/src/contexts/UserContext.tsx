import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import Message from "../Message";

interface UserCOntextType {
    user : User | null;
    loading : boolean;
    register : (userInfo : registerUser) => Promise<{status:number, message:string}>;
    logIn : (credentials : {email : string; password : string;}) => Promise<{stat : number, msg : string}>;
    updateInfo : (info : updateInfoType)=>Promise<{status:number, message:string}>;
    logOut : () => void;
    userProfile : () => User | null;
    fetchHelper : (url: string, needUser : boolean, options ?: RequestInit) => Promise<Response>;
    deleteUser: (password : string)=> Promise<{status:number, message:string}>;
    resetPassword: (pwds: resetPasswordType) => Promise<void>;
}
interface updateInfoType {
    firstName : string;
    lastName : string;
    email : string;
}

interface resetPasswordType {
    oldPwd: string;
    newPwd: string;
    confirmPwd: string;
}
interface responseType {
    status: number;
    msg: string;
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    function fetchHelper(url: string,  needUser : boolean, options : RequestInit = {}) : Promise<Response> {
        try {
            setLoading(true);   
            const token = localStorage.getItem("token");
            if (needUser && !token) {
                throw new Error("No User Found");
            }
            const headers = new Headers(options.headers);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`); 
            }
            return fetch(url, {...options, headers});
        } catch(err) {
            console.log(err);
            throw err;
        }finally{
            setLoading(false);
        }
    }

    async function checkUser() {
        try {
            // setLoading(true);
            console.log("loading:", loading);
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:3000/api/users", {
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
        // } catch(err){
        //     console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function updateInfo(info:updateInfoType) {
        try {
            setLoading(true);
            if (!user) throw new Error("No User Found");
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No Token Found");
            const response = await fetch("http://localhost:3000/api/users/updateInfo", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(info),
        });
        const data = await response.json();
        console.log(data.message);
        if (response.ok) {
            if (info.email !== user.email) {
                user.email = info.email;
            }
            if (info.firstName !== user.firstName) {
                user.firstName = info.firstName;
            }
            if (info.lastName !== user.lastName) {
                user.lastName = info.lastName;
            }
        }
        const message = data.message as string;
        return {status : response.status, message};
        // } catch(err) {
        //     console.log(err);
        //     return {status: 500, message: "Something went wrong when updating the user, plaese try again later"};
        } finally {
            setLoading(false);
        }
    }

    async function register(userInfo : registerUser) {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/users", {
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
            // return {status: 200, message: "suceessful"};
        } else {
            // return {status : response.status, message: result.message};
        }
        return {status: response.status, message: result.message};
        // } catch(err) {
        //     console.log(err);
        //     return {status: 500, message: err};
        } finally {
            setLoading(false);
        }
    }
    async function resetPassword(pwds:resetPasswordType) {
        try{
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:3000/api/users/resetPassword", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pwds),
            });
            console.log("response is: ", response);

        // }catch(err){
        //     console.log(err);
        }finally{
            setLoading(false);
        }
    }

     async function deleteUser(password:string) {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return {status: 401, message: "No Token Found"};
            const res = await fetch("http://localhost:3000/api/users", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({password})
            });
            if (res.ok) {
                logOut();
            }
            const data = await res.json();
            return {status: res.status, message: data.message};
        // } catch(err){
        //     console.log(err);
        //     return {status: 500, message: "Something went wrong when deleting the user, plaese try again later"};
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
            const response = await fetch("http://localhost:3000/api/users/login", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });
            const result = await response.json();

            const stat = response.status as number; 
            const msg = result.message;

            if (response.ok) {
                localStorage.setItem("token", result.token);
                setUser(result.user);
            }
            return {stat, msg};          
        // } catch(err) {
        //     const msg = err as string;
        //     const stat = 500;
        //     console.log(err);
        //     return {stat, msg};
        } finally {
            setLoading(false);
        }
    }

    function logOut() {
        localStorage.removeItem("token");
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
            fetchHelper,
            deleteUser,
            resetPassword,
            updateInfo
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