import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {Workout, WorkoutGenerateType} from "../types/workout";
import { useUser } from "./UserContext";

interface WorkoutContextType {
    workouts: Workout[];
    loading: boolean;
    // generateWorkout : (workout : WorkoutGenerator)=>Promise<{status: number, message: string}>;
    generateWorkout : (workout : WorkoutGenerateType)=>Promise<Response>;
    loadWorkouts: () => Promise<void>;
    deleteWorkout: (id : string) => void;
    addWorkout: (workout : Workout) => void;
    editWorkout: (workout : Workout) => Promise<Response>;
    findWorkoutById: (id : string) => Workout | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined> (undefined);

export function WorkoutProvider({children}: {children: ReactNode}) {
    const[workouts, setWorkouts] = useState<Workout[]>([]);
    const[loading, setLoading] = useState(false);
    const {user, fetchHelper} = useUser();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(()=> {
        void loadWorkouts();
    },[user]);

    
    async function editWorkout(workout : Workout) {
        try {
            setLoading(true);
            // const token = localStorage.getItem("token");
            const res = await fetchHelper(`${API_URL}/api/workouts/edit`, true, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(workout),
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.message);
            return res;
        }
        
        const newWorkout : Workout = data;
        setWorkouts((prev) => prev.map(wkout=>wkout._id === newWorkout._id? newWorkout : wkout));
        return res;
        } finally {
            setLoading(false);
        }
    }

    async function generateWorkout(workout : WorkoutGenerateType) {
        try {
            setLoading(true);
            // const token = localStorage.getItem("token");
            const res = await fetchHelper(`${API_URL}/api/workouts`, true, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(workout),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data);
        }
        
        const newWorkout : Workout = data;
        setWorkouts((prev) => [...prev, newWorkout]);
        return res;
        // } catch(err) {
        //     return {status: 500, message: err as string};
        } finally {
            setLoading(false);
        }
    }

    async function deleteWorkout(id : string) {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const res = await fetchHelper(`${API_URL}/api/workouts/${id}`, true, {
                method: "DELETE",
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res) throw new Error("Unexpected error, please try again lager");
                const data = await res.json();

            if (res.ok) {
                console.log(data.message);
                setWorkouts(prev=>prev.filter(workout => workout._id !== id)
)
            } else {
                throw new Error(data.message);
            }
        } 
        // catch(err){
        //     console.log(err);
        // } 
        finally {
            setLoading(false);
        }
    }
    function findWorkoutById(id : string) {
        const workout = workouts.find((workout) => workout._id === id);
        return workout;
    }

    async function loadWorkouts() {
        try {
            setLoading(true);

            // const token = localStorage.getItem("token");

            const headers : HeadersInit = {
                        "Content-Type": "application/json",
            }

            // if (token) {
            //     headers.Authorization = `Bearer ${token}`;
            // } 
            const response = await fetchHelper(`${API_URL}/api/workouts`, false, 
                {
                    method: "GET",
                    headers,
                }
            );
            if (!response.ok) {
                throw new Error("failed fetching workouts, sorrrry > <");
            }
            const workoutsBuffer: Workout[] = await response.json();
            setWorkouts(workoutsBuffer);
        // } catch(err){
        //     console.log(err);
        } finally {
            setLoading(false);
        }
    }


    function addWorkout(workout: Workout) {
        setWorkouts((prev)=>[...prev, workout]);
    }

    useEffect(()=> {loadWorkouts();},[]);

    return(<WorkoutContext.Provider value={
        {workouts, 
            loading, 
            generateWorkout,
            loadWorkouts, 
            addWorkout,
            editWorkout,
            deleteWorkout,
            findWorkoutById
        }}>{children}</WorkoutContext.Provider>)
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