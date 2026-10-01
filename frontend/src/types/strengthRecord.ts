import type { Exercise } from "./exercise";

export interface StrengthRecord {
    _id : string;
    name: string;
    date: Date;
    duration?: number; // in seconds
    comment: string;
    workoutRef ?: string; // id of the workout
    rating ?: number;
    exercises : Exercise[];
}

export interface StrengthRecordGenerateType {
    name: string;
    date: Date; 
    duration?: number; // in seconds
    comment?: string;
    workoutRef ?: string; // id of the workout
    rating?: string;
    exercises: OneExercise[];
}
/* 
assume the selected workout is named wkout 
const [newRecord, setNewRecord] = usestate<StrengthRecordGenerateType>({
name : wkout.name, date : new Date(), workoutRef: wkout._id, exercises: wkout.exercises.map(exinWK => {
    const newId = crypto.randomUUID();
    setNewRecord(prev => [...prev, {id: newId, exercise: exinWK.exercise, name: findExNameFromId(exinWK.exercise), sets: exinWK.sets.map((set, index) => ({
    id : crypto.randomUUID(),
    order: index+1,
    dropOrder: 1,
    reps: set.reps ?? 1,
    weight: 0
    }))}]);
})
})

wkout.exercises.map(exinWK => {
    const newId = crypto.randomUUID();
    setNewRecord(prev => [...prev, {id: newId, exercise: exinWK.exercise, name: findExNameFromId(exinWK.exercise), sets: exinWK.sets.map((set, index) => ({
    id : crypto.randomUUID(),
    order: index+1,
    dropOrder: 1,
    reps: set.reps ?? 1,
    weight: 0
    }))}]);
})


function findExNameFromId(id: string) {
    //find and return exericise name
}
*/







export interface Set { // sets order is not acccessible with index
    id: string;
    order: number; //start from 1
    // setType: string; //choose from SetType
    dropOrder : number; // for superset/dropset
    reps: number;
    weight: number; // 0 for bodyweight
}



export interface OneExercise {
    id: string;
    exercise : string; // reference to exercise id 
    name: string; // input or fetch from exericise
    sets: Set[];
    difficulty?: string;
}

// function convertExercise(wkEx: ExerciseForWorkout) {
//         const newId = crypto.randomUUID();
//         const oneEx : OneExercise = {id : crypto.randomUUID(), sets:}
//         // setExercises(prev => [...prev, {id:  newId, exercise: "", name: "", sets: []}]);
// }
