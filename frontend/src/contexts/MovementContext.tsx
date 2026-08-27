import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type { Movement } from "../types/movement";
import { useUser } from "./UserContext";
interface movData {
    name : string;
    description : string;
    muscleGroups : string[];
    equipment : string[];
}

interface MovementContextType {
    movements: Movement[];
    loading: boolean;
    refreshMovements: () => Promise<void>;
    addMovement: ({name, description, muscleGroups, equipment}: movData) => void;
    editMovement:(id : string, {name, description, muscleGroups, equipment} : movData) => Promise<void>;
    deleteMovement: ({id, forceDeletion} : {id:string; forceDeletion : boolean;}) => Promise<Response | void>;
    findMovementById: (id : string) => Movement | null;
}


const MovementContext = createContext<MovementContextType | undefined> (undefined);


export function MovementProvider({children} : {children: ReactNode}) {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(false);
    const {user, fetchHelper} = useUser();

    useEffect(()=>{
        void refreshMovements();
    },[user]);

    function findMovementById(id : string) {
        const movement = movements.find((mov) => mov._id === id);
        if (!movement) return null;
        return movement;
    }


    // need backend
    async function editMovement(id : string, {name, description, muscleGroups, equipment} : movData) {
        try {
            setLoading(true);
            const res = await fetchHelper("http://localhost:3000/api/movement/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {id, name, description, muscleGroups, equipment}),
            })
        } catch(err){
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function refreshMovements() {
        try {
            setLoading(true);
            const response = await fetchHelper(`http://localhost:3000/api/movements`, {
                    method: "GET",
                    headers : {"Content-Type": "application/json"}
                })
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

    async function addMovement({name, description, muscleGroups, equipment}: {
        name : string;
        description : string;
        muscleGroups : string[];
        equipment : string[];
    }) {
        const response = await fetchHelper("http://localhost:3000/api/movements", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, description, muscleGroups, equipment})
        });      
        // const res = await fetch("http://localhost:3000/api/movements", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`
        //     },
        //     body: JSON.stringify({name, description, muscleGroups, equipment}),
        // });

        if (!response.ok) {
            throw new Error("failed to create movement");
        }
        const newmovement : Movement = await response.json();

        setMovements((prev) => [...prev, newmovement]);
    }

/**
 * 
 * @param id 
 * @param forceDeletion 
 * @return 409 if need further confirmation
 * @return 200 if successfully deleted / no movement found
 * @return 500 if cannot delete movement
 */
    async function deleteMovement({id, forceDeletion} : {id :string, forceDeletion : boolean} ) : Promise<Response | void>{
        try {
            setLoading(true);
            console.log(id);
            const token = localStorage.getItem("token");
            const headers : HeadersInit = {
                "Content-Type": "application/json",
            }
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } else {
                throw new Error("No User Found");
            }

            const url = forceDeletion ? 
            `http://localhost:3000/api/movements/${id}?force=true`
            : `http://localhost:3000/api/movements/${id}`;

            const res = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        Authorization : `Bearer ${token}`
                    } 
                }
            );
            if (res.ok) {
                setMovements(prev => prev.filter(movement => movement._id !== id));
            }
            return res;
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }

    return (
        <MovementContext.Provider value={{
            movements,
            loading,
            refreshMovements,
            addMovement,
            editMovement,
            deleteMovement,
            findMovementById
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
