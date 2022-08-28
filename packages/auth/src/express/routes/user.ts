import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  return res.status(200).json(req.user);
}
