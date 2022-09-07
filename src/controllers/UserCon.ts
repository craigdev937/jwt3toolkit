import express from "express";

export const IndexHome: express.RequestHandler = 
(req, res) => {
    res.json({ home: "TypeScript and NodeJS" });
};



