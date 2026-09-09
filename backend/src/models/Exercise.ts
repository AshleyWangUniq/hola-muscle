import mongoose,{ Types } from "mongoose";

interface IExercise {
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  isPublic: boolean;
  belongsTo: Types.ObjectId;
//   images : string[];
}

const exerciseSchema = new mongoose.Schema<IExercise>({
    name:{
        type:String,
        required: true,
    },

    description: {
        type:String,
        required: true,
    },

    muscleGroups:{
        type: [String],
        required: true,
    },

    equipment:{
        type: [String],
        default:[],
    },

    isPublic:{
        type: Boolean,
        required: true,
        // default: false,
    },

    belongsTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        defualt:null,
        select: false,
    },
});

const Exercise = mongoose.model<IExercise>("Exercise", exerciseSchema);

export default Exercise; 