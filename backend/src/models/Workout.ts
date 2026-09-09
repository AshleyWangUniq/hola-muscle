import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";

interface ISet {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

const setSchema = new Schema<ISet>(
    {
        id: {
            type:String,
            required: true,
        },
        reps: Number,
        weight: Number,
        duration: Number
    },
    {
        _id: false
    }
)

interface IExerciseForWorkout {
    id: String;
    cardio: Boolean;
    exercise: Types.ObjectId;
    sets: ISet[];
    // duration?: number; 
}

const exForWorkoutSchema = new Schema<IExerciseForWorkout>({
    id: {
        type: String,
        required: true,
    },
    cardio: {
        type: Boolean,
        required: true,
    },
    exercise: {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
    },
    sets: {
        type: [setSchema],
        default: [],
    }
},
{
    _id: false
}
)

export interface IWorkout extends Document {
    name: string;
    exercises: IExerciseForWorkout[];
    muscleGroups: string[];
    equipment: string[]; 
    goal: string[]; // gain muscle, gain strength, loss weight
    difficulty: string; // easy medium advanced allLevel
    duration?: number; //by minutes
    isPublic: boolean;
    belongsTo?: Types.ObjectId;
}

const WorkoutSchema = new mongoose.Schema<IWorkout>({
    name: {
        type:String,
        required: true,
    },

    exercises: {
        type: [exForWorkoutSchema],
        required: true,
    },
    
    muscleGroups: {
        type: [String],
        default: [],
    },

    equipment: {
        type: [String],
        default:[],
    },

    goal: {
        type: [String],
        required: true,
    },

    difficulty: {
        type: String,
        required: true,
    },

    duration: {
        type: Number,
    },

    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },

    belongsTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        defualt:null,
        select: false,
    },

});

const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);

export default Workout;