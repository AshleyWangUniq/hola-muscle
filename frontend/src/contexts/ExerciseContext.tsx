import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type { Exercise } from "../types/exercise";
import { useUser } from "./UserContext";
interface exerciseData {
    name : string;
    description : string;
    muscleGroups : string[];
    equipment : string[];
}

interface ExerciseContextType {
    exercises: Exercise[];
    loading: boolean;
    refreshExercises: () => Promise<void>;
    addExercise: ({name, description, muscleGroups, equipment}: exerciseData) => Promise<{status: number, message: string}>;
    editExercise:(id : string, {name, description, muscleGroups, equipment} : exerciseData) => Promise<Response | void>;
    deleteExercise: ({id, forceDeletion} : {id:string; forceDeletion : boolean;}) => Promise<Response | void>;
    findExerciseById: (id : string) => Exercise | undefined;
}


const ExerciseContext = createContext<ExerciseContextType | undefined> (undefined);


export function ExerciseProvider({children} : {children: ReactNode}) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const {user, fetchHelper} = useUser();
    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(()=>{
        refreshExercises();
        // console.log(exercises);
    },[user]);

    function findExerciseById(id : string) {
        const exercise = exercises.find((exercise) => exercise._id === id);
        return exercise;
    }


    // need backend
    async function editExercise(id : string, {name, description, muscleGroups, equipment} : exerciseData) {
        try {
            setLoading(true);
            const res = await fetchHelper(`${API_URL}/api/exercises/edit`, true, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {id, name, description, muscleGroups, equipment}),
            })

            if (res.ok) {
                setExercises(prev => prev.map(exercise => exercise._id ===id ? {...exercise, 
                    name:name, 
                    description:description,
                    muscleGroups:muscleGroups,
                    equipment:equipment
                } : exercise));
            }
            return res;
        // } catch(err){
        //     console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function refreshExercises() {
        try {
            setLoading(true);
            console.log("refreshing exlist");
            const response = await fetchHelper(`${API_URL}/api/exercises`, false, {
                    method: "GET",
                    headers : {"Content-Type": "application/json"}
                })
            if (!response.ok) {
                throw new Error("Failed to fetch exercises");
            }

            const refreshedExs : Exercise[]= await response.json();
            console.log(refreshedExs);
            setExercises(refreshedExs);
        // } catch (err) {
        //     console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function addExercise({name, description, muscleGroups, equipment}: exerciseData) {
        try {
            setLoading(true);
        const exists = exercises.some(exercise => exercise.name === name);
        if (exists) {
            return {status: 409, message: "Exercise exists, please change exercise name"};
        }
        const response = await fetchHelper(`${API_URL}/api/exercises`, true, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, description, muscleGroups, equipment})
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.message);
            // throw new Error(data);
        } else {
            console.log("ex created");
        }
        const newExercise : Exercise = data;
        setExercises((prev) => [...prev, newExercise]);
        return {status: response.status, message: "new exercise created"};
    // } catch(err) {
    //     return {status: 500, message: err as string};
    } finally {
        setLoading(false);
    }
    }

/**
 * 
 * @param id 
 * @param forceDeletion 
 * @return 409 if need further confirmation
 * @return 200 if successfully deleted / no exercise found
 * @return 500 if cannot delete exercise
 */
    async function deleteExercise({id, forceDeletion} : {id :string, forceDeletion : boolean} ) : Promise<Response | void>
    {
        try {
            setLoading(true);
            console.log(id);

            const url = forceDeletion ? 
            `${API_URL}/api/exercises/${id}?force=true`
            : `${API_URL}/api/exercises/${id}`;

            const res = await fetchHelper(url, true, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res.ok) {
                setExercises(prev => prev.filter(exercise => exercise._id !== id));
            }
            
            if (res.status === 404) {
                console.log("didn't find ex");
                await refreshExercises();
            }
            return res;
        } finally {
            setLoading(false);
        }
    }

    return (
        <ExerciseContext.Provider value={{
            exercises,
            loading,
            refreshExercises,
            addExercise,
            editExercise,
            deleteExercise,
            findExerciseById
        }} >{children}</ExerciseContext.Provider>
    )
}

export function useExercises() {
    const context = useContext(ExerciseContext);

    if (!context) {
        throw new Error("Failed loading exercises");
    }
    return context;
}
