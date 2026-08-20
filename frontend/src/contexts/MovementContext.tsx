// interface movemetn
// interface movement context
    // movemetns, loading, refreshing function, add movement function
// context creator 
// interface for provider 

//main function providor 
    // two functions refreshmovemetns, add movement to movements 
 //consts loading movements
 // fetch movemetns from server
 // save movemetns 
 // 
import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type { Movement } from "../types/movement";



interface MovementContextType {
    movements: Movement[];
    loading: boolean;
    refreshMovements: () => Promise<void>;
    addMovement: (movement : Movement) => void;
}

const MovementContext = createContext<MovementContextType | undefined> (undefined);


export function MovementProvider({children} : {children: ReactNode}) {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(false);

    async function refreshMovements() {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const headers : HeadersInit = {
                "Content-Type": "application/json",
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`http://localhost:3000/api/movements`,
                {
                    method: "GET",
                    headers,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch movements");
            }

            const movs : Movement[]= await response.json();
            setMovements(movs);


        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    } 

    function addMovement(movement : Movement) {
        setMovements((prev) => [...prev, movement]);
    }

    useEffect(() => {refreshMovements();}, []);

    return (
        <MovementContext.Provider value={{
            movements,
            loading,
            refreshMovements,
            addMovement,
        }} >{children}</MovementContext.Provider>
    )
}

export function useMovements() {
    const context = useContext(MovementContext);

    if (!context) {
        throw new Error("Failed loading movements");
    }

    return context;
}
