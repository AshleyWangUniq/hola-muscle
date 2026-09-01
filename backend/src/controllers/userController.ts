import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import { type MyJwtPayload } from "../middleware/authMiddleware";

// app.post("/api/Users", async (req, res) => {

 function tokenGenerator(user: IUser) {
  return jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    )
}

export async function createUser(
    req: Request,
    res: Response
){
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
}

export async function logIn(
    req: Request,
    res: Response
) {
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
}
export async function profile(
    req: AuthRequest,
    res: Response
) {
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
}