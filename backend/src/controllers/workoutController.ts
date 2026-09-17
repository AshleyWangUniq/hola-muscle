import { AuthRequest } from "../middleware/authMiddleware";
import type { Response } from "express";

import Workout from "../models/Workout";

// route.post("/api/workoutgeneration", authMiddleware, async (req: AuthRequest, res) => {
export async function generation(
    req: AuthRequest,
    res: Response
) {
  try {
    const workout = req.body;
    if (!req.user) return res.status(401).json({message: "No user found"});
    const newWorkout = await Workout.create({...workout, belongsTo: req.user.id});

    res.status(201).json(newWorkout);
    // console.dir(req.body, { depth: null });

  } catch (err) {
    res.status(500).json({message: "Failed to create workout!"});
  }
}

export async function editWorkout(
    req: AuthRequest,
    res: Response
) {
  try {
    const workout = req.body;
    if (!req.user) return res.status(401).json({message: "No user found"});
    const updated = await Workout.findOneAndUpdate({
      _id : workout._id, 
      belongsTo: req.user.id}, workout, {new : true});

    res.status(201).json(updated);
    console.dir(req.body, { depth: null });

  } catch (err) {
    res.status(500).json({message: "Failed to create workout!"});
  }
}

export async function deletion(
    req: AuthRequest,
    res: Response,
) {
  try {
    if (!req.user) {
      throw new Error("No user found");
    }
    const deletion = await Workout.findOneAndDelete({
      _id: req.params.id,
      belongsTo: req.user.id
    })

    if (!deletion) return res.status(200).json({message: "No Workout Found"});

    return res.status(200).json({message:"Workout Deleted"});
  } catch(err) {
    return res.status(500).json(err);
  }
}

export async function getWorkouts(
    req: AuthRequest,
    res: Response
){
      try{
        let workouts;
        if (req.user) {
          workouts = await Workout.find({
            $or:
            [{belongsTo: req.user.id},
              {isPublic: true},
            ]});
        } else{
          workouts = await Workout.find({isPublic: true});
        }
        return res.status(200).json(workouts);
      } catch(err) {
        res.status(500).json({message: "Failed to fetch workouts"});
      }
}