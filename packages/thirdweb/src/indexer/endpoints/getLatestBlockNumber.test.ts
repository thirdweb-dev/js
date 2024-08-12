import { describe, expect, it } from "vitest";

import { defineChain } from "../../chains/utils.js";
import { createThirdwebClient } from "../../client/client.js";
import { getLatestBlockNumber } from "./getLatestBlockNumber.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "chainsaw.getLatestBlockNumber",
  () => {
    const SECRET_KEY = process.env.TW_SECRET_KEY as string;
    const client = createThirdwebClient({ secretKey: SECRET_KEY });

    it("gets latest block number", async () => {
      const { latestBlockNumber } = await getLatestBlockNumber({
        client,
        chain: defineChain(1),
      });
      expect(latestBlockNumber).toBeTypeOf("number");
    });
  },
);
