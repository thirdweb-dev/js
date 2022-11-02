import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";

interface EmailSignupPayload {
  email: string;
  send_welcome_email?: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { email, send_welcome_email = false } = JSON.parse(
    req.body,
  ) as EmailSignupPayload;

  invariant(process.env.BEEHIIV_API_KEY, "missing BEEHIIV_API_KEY");

  const response = await fetch("https://api.beehiiv.com/v1/subscribers", {
    headers: {
      "Content-Type": "application/json",
      "X-ApiKey": process.env.BEEHIIV_API_KEY,
    },
    method: "POST",
    body: JSON.stringify({
      email,
      publication_id: "9f54090a-6d14-406b-adfd-dbb30574f664",
      send_welcome_email,
      utm_source: "thirdweb.com",
    }),
  });

  return res.status(response.status).json({ status: response.statusText });
};

export default withSentry(handler);
