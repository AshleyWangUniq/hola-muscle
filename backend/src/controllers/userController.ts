import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import { type MyJwtPayload } from "../middleware/authMiddleware";
import e from "express";

// app.post("/api/Users", async (req, res) => {

 function tokenGenerator(user: IUser) {
  return jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    )
}
// export async function resetPassword() {
//   req: 
// }

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

export async function updateInfo(
  req: AuthRequest,
  res: Response
) {
  console.log("updating user info");
  if(!req.user) {
    return res.status(401).json({message: "Unauthorized"});
  }
  const user = await User.findOne({_id: req.user.id});
  if (!user) {
    return res.status(404).json({message: "User not found"});
  }
  const {firstName, lastName, email} = req.body;
  if (firstName!== undefined) {
    user.firstName = firstName;
  }
  if (lastName!== undefined) {
    user.lastName = lastName;
  }
  if (email!== undefined && email != user.email) {
    const existence = await User.findOne({email});
    if (existence) {
      return res.status(409).json({message: "Email is already in use!",});
    }
    user.email = email;
  }
  await user.save();
  return res.status(200).json({message: "Information is updated"});
}

export async function resetPasswords(
  req: AuthRequest,
  res: Response
) {
  if(!req.user) {
    return res.status(401).json({message: "Unauthorized"});
  }
  const user = await User.findOne({_id: req.user.id}).select("+password");
  if (!user) {
    return res.status(404).json({message: "User not found"});
  }

  const {oldPwd, newPwd, confirmPwd} = req.body;
  const isMatch = await bcrypt.compare(oldPwd, user.password);
  if (!isMatch) {
    return res.status(401).json({message: "Incorrect Password"});
  }
  if (newPwd !== confirmPwd) {
    return res.status(401).json({message: "Confirm password doesn't match"});
  }
  user.password = await bcrypt.hash(newPwd, 10);;
  await user.save();
  return res.status(200).json({message: "Password is updated"});
}

export async function deletion(
  req: AuthRequest,
  res: Response
) {
  const password = req.body.password;
  if(!req.user) {
    return res.status(401).json({message: "Unauthorized"});
  }
  const user = await User.findOne({_id: req.user.id}).select("+password");
  if (!user) {
    return res.status(404).json({message: "User not found"});
  }
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({message: "Incorrect Password"});
}
await user.deleteOne();
return res.status(200).json({message: "User deleted"});
}

export async function logIn(
    req: Request,
    res: Response
) {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");
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