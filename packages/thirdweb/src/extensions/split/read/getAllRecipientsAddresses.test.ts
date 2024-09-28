import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deploySplitContract } from "../../../extensions/prebuilts/deploy-split.js";
import { getAllRecipientsAddresses } from "./getAllRecipientsAddresses.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("getAllRecipientsAddresses", () => {
  it("should work", async () => {
    const payees = [
      "0x12345674b599ce99958242b3D3741e7b01841DF3",
      "0xA6f11e47dE28B3dB934e945daeb6F538E9019694",
    ];
    const address = await deploySplitContract({
      account: TEST_ACCOUNT_C,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      params: {
        name: "split-contract",
        contractURI: TEST_CONTRACT_URI, // just to speed up the test
        payees,
        shares: [
          5100n, // 51%
          4900n, // 49%
        ],
      },
    });
    const contract = getContract({
      address,
      chain,
      client,
    });
    const result = await getAllRecipientsAddresses({ contract });
    expect(result).toStrictEqual(payees);
  });
});
