// import mongoose, {Schema} from "mongoose";
// import {Types} from 'mongoose';

// interface ISet {
//     id : string;
//     order : number;
//     dropOrder : number;
//     reps: number;
//     weight : number;
// }

// const setSchema = new Schema<ISet>(
//     {
//         id: {
//             type:String,
//             required: true,
//         },
//         order: {
//             type:Number,
//             required: true,
//         },
//         dropOrder: {
//             type:Number,
//             required: false,
//         },
//         reps: {
//             type:Number,
//             required: true,
//         },
//         weight: {
//             type:Number,
//             required: true,
//         },
//     },
//         {
//             _id: false
//         }
// )

// interface IOneExercise {
//     id: string;
//     exercise : string; // reference to exercise id 
//     name: string; // input or fetch from exericise
//     sets: ISet[];
//     difficulty?: string;
// }

// const OneExerciseSchema = new Schema<IOneExercise>({
//     id: {
//         type: String,
//         required: true,
//     },
//     exercise: {
//         type: String,
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     sets: {
//         type: [setSchema],
//         required: true,
//     },
//     difficulty: String,
// },
// {
//     _id: false
// }
// )

import mongoose, { Schema, Types, Document } from "mongoose";

interface IStrengthSet {
    id: string;
    order: number;
    dropOrder: number;
    reps: number;
    weight: number;
}

const strengthSetSchema = new Schema<IStrengthSet>(
    {
        id: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
        dropOrder: {
            type: Number,
            required: true,
        },
        reps: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

interface IRecordExercise {
    id: string;
    exercise: Types.ObjectId;
    name: string;
    sets: IStrengthSet[];
    difficulty?: string;
}

const recordExerciseSchema = new Schema<IRecordExercise>(
    {
        id: {
            type: String,
            required: true,
        },
        exercise: {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        sets: {
            type: [strengthSetSchema],
            default: [],
        },
        difficulty: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

export interface IStrengthRecord extends Document {
    name: string;
    date: Date;
    duration?: number;
    comment?: string;
    workoutRef?: Types.ObjectId;
    rating?: string;
    exercises: IRecordExercise[];
    belongsTo: Types.ObjectId;
}

const strengthRecordSchema = new Schema<IStrengthRecord>(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
        },
        comment: {
            type: String,
        },
        workoutRef: {
            type: Schema.Types.ObjectId,
            ref: "Workout",
        },
        rating: {
            type: String,
        },
        exercises: {
            type: [recordExerciseSchema],
            default: [],
        },
        belongsTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const StrengthRecord = mongoose.model<IStrengthRecord>(
    "StrengthRecord",
    strengthRecordSchema
);

export default StrengthRecord;