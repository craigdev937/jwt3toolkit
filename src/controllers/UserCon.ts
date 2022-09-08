import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../models/Users";

class UserClass {
    Register: express.RequestHandler = 
    async (req, res, next) => {
        const { username, email, password }: 
        Omit<IUser, "id"> = req.body;
        try {
            if (!username || !password || !email) {
                return res.status(400)
                .json({msg: "Please fill out all fields"});
            };
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400)
                .json({msg: "That User already exists!"});
            };
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await UserModel.create({
                username, email,
                password: hashedPassword
            });
            res.status(201)
            .json({...(user._doc as IUser), 
                token: this.generateJWT(user._id)});
        } catch (error: any) {
            res.status(500).json({msg: error.message});
            next(error);
        }
    };

    Login: express.RequestHandler = 
    async (req, res, next) => {
        const { email, password }: { 
            email: string, password: string
        } = req.body;
        try {
            if (!email || !password) {
                return res.status(400)
                .json({msg: "Missing E-mail or Password!"});
            };
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400)
                .json({msg: "That User doesn't exist!"});
            };
            const isPasswordValid = 
                await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400)
                .json({msg: "Invalid Password!"});
            };
            res.status(201)
            .json({...(user._doc as IUser), 
                    token: this.generateJWT(user._id)});
        } catch (error: any) {
            res.status(500).json({msg: error.message});
            next(error);
        }
    };

    GetUsers: express.RequestHandler = 
    async (req, res, next) => {
        try {
            const users = await UserModel.find()
            .select("-password")
            .lean()
            if (!users?.length) {
                return res.status(400)
                .json({msg: "No Users Found!"});
            }
            res.json(users);
        } catch (error: any) {
            res.status(500).json({msg: error.message});
            next(error);
        }
    };

    generateJWT(id: IUser): string {
        return jwt.sign({ id }, 
            process.env.JWT_SECRET as string, {
                expiresIn: "1d"
        });
    };
};

export const USER: UserClass = new UserClass();





