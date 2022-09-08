import express from "express";
import { USER } from "../controllers/UserCon";

export const UserRt: express.Router = express.Router();
    UserRt.post("/register", USER.Register);
    UserRt.post("/login", USER.Login);
    UserRt.get("/", USER.GetUsers);


