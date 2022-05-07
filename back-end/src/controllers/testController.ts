import { Request, Response } from "express";
import {clearDb,seedDb} from "../repositories/testRepositories.js"

export async function clear(req: Request, res:Response) {
    await clearDb()
    res.sendStatus(200);
}

 export async function seed(req: Request, res:Response) {
    await seedDb()
    res.sendStatus(201);
}