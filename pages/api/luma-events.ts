import type { NextApiRequest, NextApiResponse } from "next";
import { LumaEvent } from "pages/events";

type LumaResponse = {
  entries: LumaEvent[];
};

type ErrorResponse = {
  message: string;
  error: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LumaResponse | ErrorResponse>,
): Promise<void> {
  const date = new Date().toISOString();
  const url = `https://api.lu.ma/public/v2/event/get-events-hosting?series_mode=series&after=${date}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_API_KEY as string,
      },
    });

    const data: LumaResponse = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
}
