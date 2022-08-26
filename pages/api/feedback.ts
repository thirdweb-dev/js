import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";
import { shortenAddress } from "utils/usedapp-external";

interface FeedbackPayload {
  scope: string;
  rating: number;
  feedback: string;
  address: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { feedback, rating, scope, address } = req.body as FeedbackPayload;

  let _rating = rating;
  // rating cannot be > 5
  if (_rating > 5) {
    _rating = 5;
  }
  // rating cannot be below 1
  if (_rating < 1) {
    _rating = 1;
  }

  const payload = {
    embeds: [
      {
        title: "New Product Feedback",
        timestamp: new Date(),
        author: {
          name: shortenAddress(address),
          url: `https://thirdweb.com/${address}`,
        },
        fields: [
          { name: "Product Scope", value: scope, inline: true },
          {
            name: "Rating",
            value: `${Array(_rating).fill("⭐️").join("")}`,
            inline: true,
          },
          { name: "Feedback", value: `\`\`\`${feedback || "N/A"}\`\`\`` },
        ],
        color: 5793266,
      },
    ],
  };

  invariant(process.env.FEEDBACK_WEBHOOK_URL, "missing FEEDBACK_WEBHOOK URL");

  const response = await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.status(response.status).json({ status: response.statusText });
};

export default withSentry(handler);
