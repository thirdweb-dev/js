import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { sepolia } from "../chains/chain-definitions/sepolia.js";
import { getContract } from "../contract/contract.js";
import * as Nebula from "./index.js";

// reenable manually for nebula testing
describe.runIf(process.env.TW_SECRET_KEY).skip("execute", () => {
  it("should execute a tx", async () => {
    await expect(
      Nebula.execute({
        client: TEST_CLIENT,
        message: `send 0.0001 ETH to ${TEST_ACCOUNT_B.address}`,
        account: TEST_ACCOUNT_A,
        contextFilter: {
          chains: [sepolia],
          walletAddresses: [TEST_ACCOUNT_A.address],
        },
      }),
    ).rejects.toThrow(/insufficient funds for gas/); // shows that the tx was sent
  });

  // TODO make this work reliably
  it("should execute a contract call", async () => {
    const nftContract = getContract({
      client: TEST_CLIENT,
      chain: sepolia,
      address: "0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
    });

    const response = await Nebula.execute({
      client: TEST_CLIENT,
      messages: [
        {
          role: "user",
          content: `approve 1 token of token id 0 to ${TEST_ACCOUNT_B.address} using the approve function`,
        },
      ],
      account: TEST_ACCOUNT_A,
      contextFilter: {
        chains: [nftContract.chain],
        contractAddresses: [nftContract.address],
      },
    });
    expect(response.transactionHash).toBeDefined();
  });
});
