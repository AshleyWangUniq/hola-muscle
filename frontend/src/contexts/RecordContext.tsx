import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { StrengthRecord, StrengthRecordGenerateType, OneExercise, Set } from "../types/strengthRecord";

import { useUser } from "./UserContext";

interface RecordContextType {
    records: StrengthRecord[];
    loading: boolean;
    refreshRecords: () => Promise<void>;
    // addRecord: ({name, date, duration, comment, workoutRef, rating, exercises }:StrengthRecordGenerateType) => Promise<Response>;
        addRecord: (params:StrengthRecordGenerateType) => Promise<void>;

}

const RecordContext = createContext<RecordContextType | undefined> (undefined);

export function RecordProvider({children} : {children : ReactNode}) {
    const [records, setRecords] = useState<StrengthRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const {user, fetchHelper} = useUser();

    // useEffect(()=> {
    //     // refreshRecords();
    // }, [user]);

    async function refreshRecords() {
        try {
            setLoading(true);
            const res =  await fetchHelper(`http://localhost:3000/api/records`, true, {
                method: "POST",
                headers : {"Content-Type": "application/json"}
            });
            if (!res.ok) {
                throw new Error("something went wrong");
            }
            const records : StrengthRecord[] = await res.json();
            setRecords(records);
        } catch(err) {
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    async function addRecord(params:StrengthRecordGenerateType) {
        try {
            setLoading(true);
            const res = await fetchHelper(`http://localhost:3000/api/records`, true, {
                method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
            })

            const data = await res.json();
            if (!res.ok) throw new Error(data);
            const newRecord : StrengthRecord = data;
            setRecords(prev => [...prev, newRecord]);
            return ;
        } finally{
            setLoading(false);
        }
    }

    return (
        <RecordContext.Provider value={{
            records,
            loading,
            refreshRecords,
            addRecord
        }}></RecordContext.Provider>
    )
}

export function useRecords() {
    const context = useContext(RecordContext);

    if (!context) {
        throw new Error("Failed loading records");
    }

    return context;
}