import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler() {
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

    if (!response.ok) {
      return NextResponse.json(
        { message: "Error fetching luma events" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching luma events", error },
      { status: 500 },
    );
  }
}
