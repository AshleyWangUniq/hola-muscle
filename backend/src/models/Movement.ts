import mongoose,{ Types } from "mongoose";

interface IMovement {
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  isPublic: boolean;
  belongsTo: Types.ObjectId;
//   images : string[];
}

const movementSchema = new mongoose.Schema<IMovement>({
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

const Movement = mongoose.model<IMovement>("Movement", movementSchema);

export default Movement; 