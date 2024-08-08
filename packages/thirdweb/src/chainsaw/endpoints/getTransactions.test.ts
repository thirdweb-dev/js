import { describe, expect, it } from "vitest";

import { createThirdwebClient } from "../../client/client.js";
import { getTransactions } from "./getTransactions.js";

describe.runIf(process.env.TW_SECRET_KEY)("chainsaw.getTransactions", () => {
  const SECRET_KEY = process.env.TW_SECRET_KEY as string;
  const client = createThirdwebClient({ secretKey: SECRET_KEY });

  it("gets transactions", async () => {
    const contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // uniswap v2
    const { transactions } = await getTransactions({
      client,
      chainIds: [1],
      to: contractAddress,
      pageSize: 10,
    });
    expect(transactions).toHaveLength(10);
    for (const transaction of transactions) {
      expect(transaction.chainId).toEqual(1);
      expect(transaction.time).toBeTypeOf("string");
      expect(transaction.to).toEqual(contractAddress.toLowerCase());
      expect(transaction.from).toBeTypeOf("string");
      expect(transaction.hash).toBeTypeOf("string");
      expect(transaction.index).toBeTypeOf("number");
      expect(transaction.blockNumber).toBeTypeOf("bigint");
      expect(transaction.blockHash).toBeTypeOf("string");
      expect(transaction.value).toBeTypeOf("bigint");
      expect(transaction.gasLimit).toBeTypeOf("string");
      expect(transaction.success).toBeTypeOf("boolean");
      expect(transaction.type).toBeTypeOf("string");
      expect(transaction.nonce).toBeTypeOf("number");
      expect(transaction.data).toBeTypeOf("string");
      expect(transaction.gasUsed).toBeTypeOf("string");
    }
  });
});
