import { describe, expect, it } from "vitest";

import { createThirdwebClient } from "../../client/client.js";
import { getBlock } from "./getBlock.js";

describe.runIf(process.env.TW_SECRET_KEY)("chainsaw.getBlock", () => {
  const SECRET_KEY = process.env.TW_SECRET_KEY as string;
  const client = createThirdwebClient({ secretKey: SECRET_KEY });

  it("gets block", async () => {
    const block = await getBlock({ client, chainId: 1, blockNumber: 20484878 });
    expect(block).toEqual({
      baseFeePerGas: 11109371721n,
      blobGasUsed: undefined,
      blockNumber: "20484878",
      chainId: 1,
      difficulty: 0n,
      excessBlobGas: undefined,
      gasLimit: 30000000n,
      gasUsed: 9654699n,
      hash: "0x7252aef522faa56116b32ed938acb39c3fa7fcbaf0b0b38c800492e198f194b7",
      logsBloom: null,
      miner: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      nonce: "0x0000000000000000",
      number: null,
      parentHash:
        "0x07e6473dee8f749a4380c03fa9c68194209f33d5eb715cb55bfe2f6a18a38111",
      size: undefined,
      time: "2024-08-08T15:51:23.000Z",
      timestamp: undefined,
      totalDifficulty: null,
      transactions: undefined,
      version: 0,
    });
  });
});
