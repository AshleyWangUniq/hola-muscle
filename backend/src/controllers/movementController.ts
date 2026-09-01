// route.post("/api/movements", authMiddleware, async (req: AuthRequest, res) => {
import { Auth } from "mongodb";
import { AuthRequest } from "../middleware/authMiddleware";
import Movement from "../models/Movement";
import type { Response } from "express";
import Workout from "../models/Workout";

export async function generateMovement(
        req: AuthRequest,
        res: Response
    ) {
 try{
  const {name, description, muscleGroups, equipment} = req.body;
  if (!req.user) return res.status(401).json({message: "No user found"});

  const newMov = await Movement.create({
    name,
    description,
    muscleGroups,
    equipment,
    isPublic: false,
    belongsTo: req.user.id,
  });
  res.status(201).json(newMov);
 } catch (err) {
  res.status(500).json({message: "Failed to create movement!"});
 }
}

export async function getMovements(
    req: AuthRequest,
    res: Response
) {
  try {
    const targetMuscle = req.query.muscleGroup as string;
    let movements;

    if (targetMuscle) {
      if (!req.user) {
        // return only public mocements 
         movements = await Movement.find({isPublic: true, muscleGroups: targetMuscle});
      } else {
        //return both public and user movements d
         movements = await Movement.find({muscleGroups: targetMuscle, belongsTo: req.user.id});
      }
    } else {
      if (!req.user) {
        movements = await Movement.find({isPublic: true});
      } else {
        movements = await Movement.find({
          $or: [
            {isPublic: true},
            {belongsTo: req.user.id},
          ]
        });
      }
       
    }
    return res.status(200).json(movements);
  } catch(err) {
    res.status(500).json({message: "Failed to fetch movements"});
  }
}



// route.delete("/api/movements/:id", authMiddleware, async (req: AuthRequest, res) => {
export async function deleteMovement(
    req: AuthRequest,
    res: Response
) {
  try {
    if (!req.user) {
      throw new Error("Not logged user");
    }
    const movid = req.params.id;
    if (typeof movid !== "string") {
    return res.status(400).json({
        message: "Invalid movement ID"
    });
}
    const forceDelete = req.query.force === "true";
    //check if movement is used by any workout
    const isUsed = await Workout.exists({"movements.movement" : movid});

    if (isUsed && !forceDelete) {
      const workoutnames = await Workout.find({
        belongsTo: req.user.id,
        "movements.movement" : movid
      }).select("name");
      return res.status(409).json({
        message: "The movement is used in other workouts, do you still want to delete it?",
        requiresConfirmation: true,
        workouts: workoutnames
      })
    }
    if (isUsed && forceDelete) {
    // delete movement from all workouts 
      Workout.updateMany({
        belongsTo: req.user.id,
        "movements.movement" : movid
      },
    {
      $pull: {
        movements: {
          movement : req.params.id
        }
      }
    })
    }

    //delete the movement
    const deletion = await Movement.findOneAndDelete({
      _id: req.params.id,
      belongsTo: req.user.id
    })
    
    
    if (!deletion) return res.status(404).json({message: "No Movement Found"});

    return res.status(200).json({message:"Movement Deleted"});

  } catch(err) {
    res.status(500).json({message: "Failed to delete movement >_<", errormessage: err});
  }
}


// app.post("/api/movement/edit", authMiddleware, async (req: AuthRequest, res) => {
export async function editMovement(
    req: AuthRequest,
    res: Response
) {
  try {
    const {id, name, description, muscleGroups, equipment} = req.body;
    if (!req.user) return res.status(401).json({message: "No user found"});

    const result = await Movement.updateOne(
      {_id : id},
      {$set: {name : name, description : description, muscleGroups : muscleGroups, equipment : equipment}}
    );if (result.matchedCount === 0) {
      return res.status(404).json({message: "No movement found"});
      }
      if (result.matchedCount === 1 && result.modifiedCount === 0) {
        return res.status(304).json({message:"Identical movements, no change made"});
      }
    return res.status(200).json({message: "Movement updated."});
  } catch(err) {
    res.status(500).json({ message: "Failed to update movement" });
  }
}
