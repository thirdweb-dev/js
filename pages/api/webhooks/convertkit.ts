import type { NextApiRequest, NextApiResponse } from "next";

interface ConvertkitPayload {
  subscriber: {
    id: number;
    first_name: string;
    email_address: string;
    state: string;
    created_at: string;
    fields?: Record<string, string>;
  };
}

// handles webhook from convertkit and sends it into discord
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { email_address } = (JSON.parse(req.body) as ConvertkitPayload)
    .subscriber;
  const payload = {
    embeds: [
      {
        title: "New Convertkit Subscriber",
        timestamp: new Date(),
        fields: [{ name: "Email", value: email_address }],
        color: 5793266,
      },
    ],
  };
  const response = await fetch(process.env.DISCORD_WEBHOOK_URL || "", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.status(response.status).json({ status: response.statusText });
};
