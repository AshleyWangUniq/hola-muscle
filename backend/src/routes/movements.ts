import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
    }
}

interface MyJwtPayload extends JwtPayload {
    userId: string;
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({message: "hi, no token passed"});


    const token = header.split(" ")[1]!;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    console.log("decoded is", decoded);


    req.user = {
        id : decoded.userId,
    };

    next();
}

export function optionalAuthMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    console.log("optional auth pause 1");

    if (!header) {
        console.log("optional auth pause no header");
        return next();
    } else {
        const token = header.split(" ")[1]!;
        console.log("optional auth pause inside header", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
        console.log("decoded is", decoded);

        req.user = {
            id : decoded.userId,
        };
    }
    next();
}