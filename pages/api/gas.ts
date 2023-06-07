import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  if (req.method !== "GET") {
    return NextResponse.json(
      { error: "invalid method" },
      {
        status: 400,
      },
    );
  }

  const gasPriceEndpoint = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_KEY}`;
  const ethPriceEndpoint = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_KEY}`;

  const gasPrice = fetch(gasPriceEndpoint);
  const ethPrice = fetch(ethPriceEndpoint);

  try {
    const [gasPriceRes, ethPriceRes] = await Promise.all([gasPrice, ethPrice]);
    const gasData = await gasPriceRes.json();
    const ethPriceData = await ethPriceRes.json();

    if (!gasData?.result) {
      return NextResponse.json(
        { error: "Failed to fetch gas price" },
        {
          status: 400,
        },
      );
    }

    if (!ethPriceData?.result) {
      return NextResponse.json(
        { error: "Failed to fetch ETH price" },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        gasPrice: gasData.result.ProposeGasPrice,
        ethPrice: ethPriceData.result.ethusd,
      },
      {
        status: 200,
        headers: [
          // cache for 60 seconds, with up to 120 seconds of stale time
          ["Cache-Control", "public, s-maxage=60, stale-while-revalidate=119"],
        ],
      },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid response" }, { status: 502 });
  }
};

export default handler;
