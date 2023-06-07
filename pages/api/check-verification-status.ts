import { apiKeyMap, apiMap } from "lib/maps";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "invalid method" }, { status: 400 });
  }

  const url = new URL(req.url);

  const guid = url.searchParams.get("guid");
  const chainId = Number(url.searchParams.get("chainId"));

  const endpoint = `${apiMap[chainId]}?module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKeyMap[chainId]}"`;

  try {
    const result = await fetch(endpoint, {
      method: "GET",
    });

    const data = await result.json();

    // if verified
    if (data.status === "1") {
      return NextResponse.json(
        { result: data.result },
        {
          status: 200,
          headers: [
            // cache forever
            ["Cache-Control", "public, max-age=31536000, immutable"],
          ],
        },
      );
    } else {
      return NextResponse.json({ result: data.result }, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
};

export default handler;
