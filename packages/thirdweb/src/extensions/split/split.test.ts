import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_D } from "~test/test-wallets.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { isAddress } from "../../utils/address.js";
import { deploySplitContract } from "../prebuilts/deploy-split.js";
import { getAllRecipientsAddresses } from "./read/getAllRecipientsAddresses.js";
import { getAllRecipientsPercentages } from "./read/getAllRecipientsPercentages.js";
import { getRecipientSplitPercentage } from "./read/getRecipientSplitPercentage.js";

let contract: ThirdwebContract;
const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("Split contract tests", () => {
  beforeAll(async () => {
    const address = await deploySplitContract({
      account: TEST_ACCOUNT_D,
      chain,
      client,
      params: {
        name: "split-contract",
        payees: [
          "0x12345674b599ce99958242b3D3741e7b01841DF3",
          "0xA6f11e47dE28B3dB934e945daeb6F538E9019694",
        ],
        shares: [
          5100n, // 51%
          4900n, // 49%
        ],
      },
    });
    expect(address).toBeDefined();
    expect(isAddress(address)).toBe(true);
    contract = getContract({
      address,
      chain,
      client,
    });
  }, 60_000);

  it("should return all recipient addresses", async () => {
    const result = await getAllRecipientsAddresses({ contract });
    expect(result).toStrictEqual([
      "0x12345674b599ce99958242b3D3741e7b01841DF3",
      "0xA6f11e47dE28B3dB934e945daeb6F538E9019694",
    ]);
  });

  it("should return all recipients and their share percentages", async () => {
    const result = await getAllRecipientsPercentages({ contract });
    expect(result).toStrictEqual([
      {
        address: "0x12345674b599ce99958242b3D3741e7b01841DF3",
        splitPercentage: 51,
      },
      {
        address: "0xA6f11e47dE28B3dB934e945daeb6F538E9019694",
        splitPercentage: 49,
      },
    ]);
  });

  it("should return split percentage for individual recipient", async () => {
    const result = await getRecipientSplitPercentage({
      contract,
      recipientAddress: "0x12345674b599ce99958242b3D3741e7b01841DF3",
    });

    expect(result).toStrictEqual({
      address: "0x12345674b599ce99958242b3D3741e7b01841DF3",
      splitPercentage: 51,
    });
  });
});
