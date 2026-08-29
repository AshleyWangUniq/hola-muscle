import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User, {type IUser} from "./models/User";
import Movement from "./models/Movement";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest, authMiddleware, optionalAuthMiddleware } from "./routes/movements";
import Workout from "./models/Workout";
// import User from "./models/user";

dotenv.config();

const app = express();
const route = express.Router();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(route);


//MongoDB connection, server starter

if (!MONGO_URI) {
  throw new Error("No MONGO_URI found in the .env file");
}

mongoose.connect(MONGO_URI)
.then(()=>{
  console.log("MongoDB connected");

  app.listen(PORT, ()=>{console.log(`Server is running on ${PORT}`);})
})
.catch((error)=>{console.error("MongoDB connection failed", error)});

app.get("/", (req, res) => {
  res.send("Server is running");
});

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

route.post("/api/workoutgeneration", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const workout = req.body;
    if (!req.user) return res.status(401).json({message: "No user found"});
    const newWorkout = await Workout.create({...workout, belongsTo: req.user.id});

    res.status(201).json(newWorkout);

    console.dir(req.body, { depth: null });

  } catch (err) {
    res.status(500).json({message: "Failed to create workout!"});
  }
});

route.post("/api/movements", authMiddleware, async (req: AuthRequest, res) => {
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
});

route.delete("/api/workout/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      throw new Error("No user found");
    }
    const deletion = await Workout.findOneAndDelete({
      _id: req.params.id,
      belongsTo: req.user.id
    })

    if (!deletion) return res.status(200).json({message: "No Movement Found"});

    return res.status(200).json({message:"Movement Deleted"});
  } catch(err) {
    return res.status(500).json(err);
  }
})

route.delete("/api/movements/:id", authMiddleware, async (req: AuthRequest, res) => {
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
    
    if (!deletion) return res.status(200).json({message: "No Movement Found"});

    return res.status(200).json({message:"Movement Deleted"});

  } catch(err) {
    res.status(500).json({message: "Failed to delete movement >_<", errormessage: err});
  }
})

route.get("/api/workouts", optionalAuthMiddleware, async (req: AuthRequest, res) => {
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
});



route.get("/api/movements", optionalAuthMiddleware, async (req: AuthRequest, res) => {
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
});


/** 
 * User Creation & Fetch(Log In)
*/
 function tokenGenerator(user: IUser) {
  return jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    )
}

app.post("/api/movement/edit",optionalAuthMiddleware, async (req: AuthRequest, res) => {
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
})

app.post("/api/Users", async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body;

    const existence = await User.findOne({email});
    if (existence) {
      return res.status(409).json({message: "Email is already in use!",});
    }

    const hashedpwd = await bcrypt.hash(password, 10);

    const newUser = new User ({
      firstName,
      lastName,
      email,
      password: hashedpwd,
    });

    await newUser.save();

    const token = tokenGenerator(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
    }});
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
})

app.post("/api/LogIn", async (req,res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");
    if (!user) {
      console.log("User not found");
    }

    if (!user) {return res.status(404).json({message: "User not found, please check your email."});}
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: "Incorrect Password"});
    }
    const token = tokenGenerator(user);

    res.status(200).json({
      token,
      user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }});
  } catch(err) {
    res.status(500).json({ message: "Failed to log in" });
  }
})

app.get("/api/profile", async (req, res) => {
  try{
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {return res.status(401).json({message: "No token Provided"});}

    const parse = authHeader.split(" "); 
    if (parse.length !== 2 || parse[0] !== "Bearer") {
      return res.status(401).json({message: "Invalid Authorization",});
    }

    const token = parse[1]!;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as MyJwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    res.status(401).json({
      message: "Oops, something wrong with token",
    });
  }
})
