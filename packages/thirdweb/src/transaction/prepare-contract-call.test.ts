import { describe, expect, test } from "vitest";

import { TEST_WALLET_B } from "../../test/src/addresses.js";

import { USDT_CONTRACT_WITH_ABI } from "../../test/src/test-contracts.js";
import { toWei } from "../utils/units.js";
import { prepareContractCall } from "./prepare-contract-call.js";

describe("prepareContractCall", () => {
  test("should prepare a contract call with ABI", () => {
    const preparedTx = prepareContractCall({
      contract: USDT_CONTRACT_WITH_ABI,
      method: "transfer",
      params: [TEST_WALLET_B, toWei("100")],
    });
    expect(preparedTx.to).toBe(USDT_CONTRACT_WITH_ABI.address);
  });
});
