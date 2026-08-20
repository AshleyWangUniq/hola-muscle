import {Children, createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {Workout} from "../types/workout";

interface WorkoutContextType {
    workouts: Workout[];
    loading: boolean;
    loadWorkouts: () => Promise<void>;
    addWorkout: (workout : Workout) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined> (undefined);

export function WorkoutProvider({children}: {children: ReactNode}) {
    const[workouts, setWorkouts] = useState<Workout[]>([]);
    const[loading, setLoading] = useState(false);

    async function loadWorkouts() {
        
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const headers : HeadersInit = {
                        "Content-Type": "application/json",
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } 
            const response = await fetch(`http://localhost:3000/api/workouts`,
                {
                    method: "GET",
                    headers,
                }
            );
            console.log(response);
            if (!response.ok) {
                throw new Error("failed fetching workouts, sorrrry > <");
            }
            const workoutsBuffer: Workout[] = await response.json();
            setWorkouts(workoutsBuffer);
        } catch(err){
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function addWorkout(workout: Workout) {
        setWorkouts((prev)=>[...prev, workout]);
    }

    useEffect(()=> {loadWorkouts();},[]);

    return(<WorkoutContext.Provider value={{workouts, loading, loadWorkouts, addWorkout}}>{children}</WorkoutContext.Provider>)
}

export function useWorkouts() {
    const context = useContext(WorkoutContext);

    if (!context) {
        throw new Error("Failed loading workouts >_<");
    }
    return context;
}

// export function WorkoutProvider({children} : children: ReactNode) {

// }