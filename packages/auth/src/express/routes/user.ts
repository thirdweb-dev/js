import { getUser } from "../helpers/user";
import { ThirdwebAuthContext } from "../types";
import { Request, Response } from "express";

export default async function handler(
  req: Request,
  res: Response,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  const user = await getUser(req, ctx);
  return res.status(200).json(user);
}
