import { ThirdwebAuthContext } from "../types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext
) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }
  
  const { sdk, domain } = ctx;
  let user = null;
  const token = req.cookies.thirdweb_auth_token;

  if (token) {
    try {
      const address = await sdk.auth.authenticate(domain, token);
      user = { address };
    } catch {
      // No-op
    }
  }

  return res.status(200).json(user);
}
