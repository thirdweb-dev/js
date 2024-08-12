import { describe, expect, it } from "vitest";

import { createThirdwebClient } from "../../client/client.js";
import { getBlock } from "./getBlock.js";
import { defineChain } from "../../chains/utils.js";

describe.runIf(process.env.TW_SECRET_KEY)("chainsaw.getBlock", () => {
  const SECRET_KEY = process.env.TW_SECRET_KEY as string;
  const client = createThirdwebClient({ secretKey: SECRET_KEY });

  it("gets block", async () => {
    const { block } = await getBlock({
      client,
      chain: defineChain(1),
      blockNumber: 20484878n,
    });
    expect(block).toEqual({
      baseFeePerGas: 11109371721n,
      blobGasUsed: undefined,
      number: 20484878n,
      difficulty: 0n,
      excessBlobGas: undefined,
      gasLimit: 30000000n,
      gasUsed: 9654699n,
      hash: "0x7252aef522faa56116b32ed938acb39c3fa7fcbaf0b0b38c800492e198f194b7",
      logsBloom: null,
      nonce: "0x0",
      size: undefined,
      timestamp: 1723132283000n,
      totalDifficulty: null,
      transactions: undefined,
    });
  });
});
