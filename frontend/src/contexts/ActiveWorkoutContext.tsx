import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { OneExercise, StrengthRecordGenerateType } from "../types/strengthRecord";
import { useUser } from "../contexts/UserContext";


interface ActiveRecordType {
    currentRecord : StrengthRecordGenerateType | null;
    status : string | undefined;
    timerDisplay : string | null;
    startWorkout : (passedWorkout ?: StrengthRecordGenerateType)=>void;
    finishWorkout: (exercises : OneExercise[])=>Promise<Response | undefined>;
    updateStatus: (stat : string)=>void;
    updateDuration: (duration : number) => void;
    updateExercises : (ex : OneExercise[]) => void;
    updateRecord: (updates : UpdateProp) => void;
    clearWorkout: () => void;
    startTimer: ()=> void;
    pauseTimer: ()=>void;
}

interface UpdateProp {
    field : string;
    content : string;
}

const ActiveRecordContext = createContext<ActiveRecordType | undefined>(undefined);

export function ActiveWorkoutProvider({children} : {children : ReactNode}) {
    const [currentRecord, setCurrentRecord] = useState<StrengthRecordGenerateType | null>(null);
    const [status, setStatus] = useState<string | undefined>(undefined);

    const [startAt, setStartAt] = useState<number | null>(null);
    const [timerDisplay, setTimerDisplay] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);

    const {fetchHelper} = useUser();

    useEffect(()=> {
        if (!startAt) return;

        const interval = setInterval(()=> {
            const dur = Date.now() - startAt + elapsed;
            updateDuration(dur);
            timeConverter(dur);
        }, 1000);

        return ()=>clearInterval(interval);
    }, [startAt, elapsed]);

    function startWorkout(passedWorkout ?: StrengthRecordGenerateType) {
        setStatus("Initiated");
        if (passedWorkout) {
            setCurrentRecord(passedWorkout);
            localStorage.setItem("activeWorkout", JSON.stringify(currentRecord));
            return;
        }
        const thisRec : StrengthRecordGenerateType = {name: "",
        date: new Date(),
        exercises: []
    };
        setCurrentRecord(thisRec);
        localStorage.setItem("activeWorkout", JSON.stringify(thisRec));
    }

    function startTimer() {
        if (startAt !== null) return;
        setStartAt(Date.now());
        setStatus("OnGoing");
    }

    function pauseTimer() {
        if (!startAt) return;
        setElapsed(prev => prev+(Date.now() - startAt)); 
        setStatus("Paused");
        setStartAt(null);
    }

    function timeConverter(interval : number) {
        const totalSeconds = Math.floor(interval / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours !== 0) {
            setTimerDisplay(`${hours}:${minutes.toString()
                    .padStart(2, "0")}:${seconds.toString()
                    .padStart(2, "0")}`);
        } else {
            setTimerDisplay(`${minutes.toString()
                    .padStart(2, "0")}:${seconds.toString()
                    .padStart(2, "0")}`);
        }
    }

    function updateDuration(duration : number) {
        setCurrentRecord(prev => prev === null ? null : {...prev, duration : duration});
    }

    function updateExercises(ex : OneExercise[]) {
        setCurrentRecord(prev => prev === null ? null : {...prev, exercises: ex});
    }

    function updateRecord(updates : UpdateProp) {
        if (!currentRecord) 
        if (!currentRecord) return;
        if (updates.field === "name") {
            setCurrentRecord(prev => prev === null ? null : {...prev, name : updates.content});
        } else if (updates.field === "date") {
            setCurrentRecord(prev => prev === null ? null : {...prev, date : new Date(updates.content)});
        } else if (updates.field === "rating") {
            setCurrentRecord(prev => prev === null ? null : {...prev, rating : updates.content});
        } else if (updates.field === "comment") {
            setCurrentRecord(prev => prev === null ? null : {...prev, comment : updates.content});
        }
    }

    function clearWorkout() {
        setCurrentRecord(null);
        setStatus(undefined);
    }

    function updateStatus(stat : string) {
        setStatus(stat);
    }

    async function finishWorkout(exercises : OneExercise[]) {
        //save to the database will be promise
        if (currentRecord === null) return;
        updateExercises(exercises);
        if (currentRecord.name === "") {
            const name : string = "Workout "+ currentRecord.date.toLocaleDateString("en-AU");
            updateRecord({field : "name", content : name});
        }

        const finalRecord : StrengthRecordGenerateType = {...currentRecord, exercises: exercises};
        
        const API_URL = import.meta.env.VITE_API_URL; 
        const res = await fetchHelper(`${API_URL}/api/strength-records`, true, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(finalRecord),
        });
        setStatus(undefined);
        return res;
    }

    return (<ActiveRecordContext.Provider 
        value={{
            currentRecord,
            status,
            timerDisplay,
            startWorkout,
            finishWorkout,
            updateStatus,
            updateDuration,
            updateExercises,
            updateRecord,
            clearWorkout,
            startTimer,
            pauseTimer
        }}>
            {children}
        </ActiveRecordContext.Provider>)
}

export function useActiveWorkout() {
    const context = useContext(ActiveRecordContext);
    
    if (!context) {
        throw new Error("Failed");
    }

    return context;
}