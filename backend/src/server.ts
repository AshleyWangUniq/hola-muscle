import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
// import User from "./models/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
console.log(process.env.MONGO_URI);

if (!MONGO_URI) {
  throw new Error("No MONGO_URI found in the .env file");
}

mongoose.connect(MONGO_URI)
.then(()=>{
  console.log("MongoDB connected");

  app.listen(PORT, ()=>{console.log(`Server is running on ${PORT}`);})
})
.catch((error)=>{console.error("MongoDB connection failed", error)});

// app.use()

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

interface Movement {
  id: number;
  name: string;
  description: string;
  musclegroups: string[];
  equipments: string[];
  images : string[];
}

const movements: Movement[] = [];

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.post("/api/movements", (req, res) => {
  const newMovement : Movement = {
    id: Date.now(),
    ...req.body,
  };

  movements.push(newMovement);
  console.log(movements);
  res.status(201).json(newMovement);
});

// app.get("/api/movements", (req, res) => {
//     res.json(movements);
// })

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

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
})

app.post("/api/LogIn", async (req,res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {return res.status(404).json({message: "User not found"});}
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: "Incorrect Password"});
    }
    const token = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    );

    res.status(200).json({message: `Hi ${user.firstName}, welcome`, token});
  } catch(err) {
    res.status(500).json({ message: "Failed to create user" });
  }
})

app.get("/api/movements", (req, res) => {
    const muscle = req.query.muscleGroup as string;
    console.log("wanted muscle group is" + muscle);

    if (muscle) {
        const movementsByMuscle = movements.filter((mov) => mov.musclegroups.includes(muscle));
        console.log(movementsByMuscle);
        res.json(movementsByMuscle);
    } else {
        res.json(movements);
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
        console.log("at least got into try part", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as MyJwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Oops, something wrong with token",
    });
  }
})
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });