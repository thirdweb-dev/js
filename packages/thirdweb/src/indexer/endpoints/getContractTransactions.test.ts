import { describe, expect, it } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { getContractTransactions } from "./getContractTransactions.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "indexer.getContractTransactions",
  () => {
    it("gets transactions", async () => {
      const contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // uniswap v2
      const contract = getContract({
        client: TEST_CLIENT,
        chain: defineChain(1),
        address: contractAddress,
      });

      const { transactions } = await getContractTransactions({
        contract,
        start: 10,
        count: 10,
      });
      expect(transactions).toHaveLength(10);
      for (const transaction of transactions) {
        expect(transaction.chainId).toEqual(1);
        expect(transaction.to).toEqual(contractAddress.toLowerCase());
        expect(transaction.from).toBeTypeOf("string");
        expect(transaction.hash).toBeTypeOf("string");
        expect(transaction.transactionIndex).toBeTypeOf("number");
        expect(transaction.blockNumber).toBeTypeOf("bigint");
        expect(transaction.blockHash).toBeTypeOf("string");
        expect(transaction.value).toBeTypeOf("bigint");
        expect(transaction.type).toBeTypeOf("string");
        expect(transaction.nonce).toBeTypeOf("number");
        expect(transaction.input).toBeTypeOf("string");
        if (transaction.gas) {
          expect(transaction.gas).toBeTypeOf("bigint");
        }
      }
    });
  },
);
