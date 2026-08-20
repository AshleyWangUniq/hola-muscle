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

// route.get("/api/movements", async (req, res) => {
//   try {
//     const movements = await Movement.find({isPublic: true});
//     return res.status(200).json(movements);
//   }
//  catch(err) {
//   res.status(500).json({message: "Failed to create movement!"});
// }
// })

route.get("/api/workouts", optionalAuthMiddleware, async (req: AuthRequest, res) => {
  try{
    let workouts;
    if (req.user) {
      console.log("good, you are logged user");
      workouts = await Workout.find({
        $or:
        [{belongsTo: req.user.id},
          {isPublic: true},
        ]});
    } else{
      console.log("Oops, general public");
      workouts = await Workout.find({isPublic: true});
    }
    return res.status(200).json(workouts);
  } catch(err) {
    console.log("sorry, error happend > <");
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

    if (!user) {return res.status(404).json({message: "User not found"});}
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
    console.log("error", err);
    res.status(401).json({
      message: "Oops, something wrong with token",
    });
  }
})
