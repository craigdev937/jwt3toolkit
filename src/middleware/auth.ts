import jwt from "jsonwebtoken";
import express from "express";
import { IUser, UserModel } from "../models/Users";

type Decoded = {
    id: string
} | string | jwt.JwtPayload;

export const protRoute = async (
    req: express.Request & { user: IUser | null }, 
    res: express.Response, 
    next: express.NextFunction
) => {
    let token;
    if (
        req.headers && 
        req.headers.authorization?.startsWith("Bearer")
    ) {
        try {
            // Get the Token from the Header.
            token = req.headers.authorization.split(" ")[1];
            // Verify the Token.
            const decoded: Decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            );
            // Get the User from the Decoded Token.
            req.user = await UserModel.findById(
                (decoded as { id: string }).id
            );
            next();
        } catch (error) {
            console.log(error);
            res.status(400).send("Invalid token");
            throw new Error("Invalid Token")
        }
    };
    if (!token) {
        res.status(401).send("No auth, token found");
        throw new Error("Invalid Token");
    }
};




