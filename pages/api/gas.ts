import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "invalid method" });
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
      return res.status(400).json({ error: "Failed to fetch gas price" });
    }

    if (!ethPriceData?.result) {
      return res.status(400).json({ error: "Failed to fetch ETH price" });
    }

    // cache for 60 seconds, with up to 120 seconds of stale time
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=119",
    );

    return res.status(200).json({
      gasPrice: gasData.result.ProposeGasPrice,
      ethPrice: ethPriceData.result.ethusd,
    });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Invalid response" });
  }
};

export default withSentry(handler);
