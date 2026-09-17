import { Auth } from "mongodb";
import { AuthRequest } from "../middleware/authMiddleware";
import Exercise from "../models/Exercise";
import type { Response } from "express";
import Workout from "../models/Workout";

export async function generateExercise(
        req: AuthRequest,
        res: Response
    ) {
 try{
  const {name, description, muscleGroups, equipment} = req.body;
  if (!req.user) return res.status(401).json({message: "No user found"});
  const exist = await Exercise.find({name: name});

  if (exist) {
    return res.status(401).json({message: "Exercise already exist"});
  }

  const newMov = await Exercise.create({
    name,
    description,
    muscleGroups,
    equipment,
    isPublic: false,
    belongsTo: req.user.id,
  });
  res.status(201).json(newMov);
 } catch (err) {
  res.status(500).json(err);
 }
}

export async function getExercise(
    req: AuthRequest,
    res: Response
) {
  try {
    const targetMuscle = req.query.muscleGroup as string;
    let exercises;

    if (targetMuscle) {
      if (!req.user) {
        // return only public mocements 
         exercises = await Exercise.find({isPublic: true, muscleGroups: targetMuscle});
      } else {
         exercises = await Exercise.find({muscleGroups: targetMuscle, belongsTo: req.user.id});
      }
    } else {
      if (!req.user) {
        exercises = await Exercise.find({isPublic: true});
      } else {
        exercises = await Exercise.find({
          $or: [
            {isPublic: true},
            {belongsTo: req.user.id},
          ]
        });
      }
       
    }
    return res.status(200).json(exercises);
  } catch(err) {
    res.status(500).json({message: "Failed to fetch exercises"});
  }
}



export async function deleteExercise(
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
        message: "Invalid exercises ID"
    });
}
    const forceDelete = req.query.force === "true";
    //check if exercises is used by any workout
    const isUsed = await Workout.exists({"exercises.exercise" : movid});

    if (isUsed && !forceDelete) {
      const workoutnames = await Workout.find({
        belongsTo: req.user.id,
        "exercises.exercise" : movid
      }).select("name");
      return res.status(409).json({
        message: "The exercise is used in other workouts, do you still want to delete it?",
        requiresConfirmation: true,
        workouts: workoutnames
      })
    }
    if (isUsed && forceDelete) {
    // delete exercise from all workouts 
      Workout.updateMany({
        belongsTo: req.user.id,
        "exercises.exercise" : movid
      },
    {
      $pull: {
        exercises: {
          exercise : req.params.id
        }
      }
    })
    }

    const deletion = await Exercise.findOneAndDelete({
      _id: req.params.id,
      belongsTo: req.user.id
    })
    
    
    if (!deletion) return res.status(404).json({message: "No Exercise Found"});

    return res.status(200).json({message:"Exercise Deleted"});

  } catch(err) {
    res.status(500).json({message: "Failed to delete Exercise >_<", errormessage: err});
  }
}


export async function editExercise(
    req: AuthRequest,
    res: Response
) {
  try {
    const {id, name, description, muscleGroups, equipment} = req.body;
    if (!req.user) return res.status(401).json({message: "No user found"});

    const result = await Exercise.updateOne(
      {_id : id, belongsTo: req.user.id},
      {$set: {name : name, description : description, muscleGroups : muscleGroups, equipment : equipment}}
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({message: "No Exercise found"});
      }
      if (result.matchedCount === 1 && result.modifiedCount === 0) {
        return res.status(304).json({message:"Identical Exercise, no change made"});
      }
    return res.status(200).json({message: "exercise updated."});
  } catch(err) {
    res.status(500).json({ message: "Failed to update exercise" });
  }
}
