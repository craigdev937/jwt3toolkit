import express from "express";
import { IndexHome } from "../controllers/UserCon";

export const UserRt: express.Router = express.Router();
    UserRt.get("/", IndexHome);


