import { withSentry } from "@sentry/nextjs";
import { isAddress } from "ethers/lib/utils";
import { resolveEns } from "lib/ens";
import { NextApiRequest, NextApiResponse } from "next";
import { getSingleQueryValue } from "utils/router";

const FIVE_MIN_IN_S = 5 * 60;
const ONE_DAY_IN_S = 24 * 60 * 60;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ensNameOrAddress = getSingleQueryValue(req.query, "ens");

  if (!ensNameOrAddress) {
    return res
      .status(400)
      .json({ error: "ens name or address must be provided" });
  }
  if (!isAddress(ensNameOrAddress) && !ensNameOrAddress.endsWith(".eth")) {
    return res.status(400).json({ error: "address / ens name are not valid" });
  }

  try {
    const result = await resolveEns(ensNameOrAddress);

    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${FIVE_MIN_IN_S}, stale-while-revalidate=${ONE_DAY_IN_S}`,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export default withSentry(handler);
