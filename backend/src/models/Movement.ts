import mongoose from "mongoose";

const movementSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
    },

    muscleGroups:{
        type: [String],
        require: true,
    },

    equipments:{
        type: [String],
        default:[],
    },

    isPublic:{
        type: Boolean,
        require: true,
    },

    belongsTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        defualt:null,
    },
});

const Movement = mongoose.model("Movement", movementSchema);

export default Movement;