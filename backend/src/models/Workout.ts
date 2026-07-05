import mongoose from "mongoose";
import { Types } from "mongoose";

interface IMovements {
    movement: Types.ObjectId;
    sets?: number;
    reps?: number;
    duration?: number;
}

interface IWorkout {
    name: string;
    movements: IMovements[];
    muscleGroups: string[];
    equipment: string[]; 
    goal: string[]; // gain muscle, gain strength, loss weight
    difficulty: string[]; // easy medium advanced allLevel
    duration?: number; //by minutes
}

const WorkoutSchema = new mongoose.Schema<IWorkout>({
    name: {
        type:String,
        required: true,
    },

    movements: [
        {
            movement: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Movement",
                required: true,
            },

            sets:{
                Types: String,
            },

            reps: {
                Types: String,
            },
        }
    ],

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
        type: [String],
        required: true,
    },

    duration: {
        type: Number,
    }

});

const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);

export default Workout;