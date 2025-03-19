import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_B } from "../../../test/src/test-wallets.js";
import { typedData } from "../../../test/src/typed-data.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { smartWallet } from "../smart/smart-wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { engineAccount } from "./index.js";

describe.runIf(
  process.env.TW_SECRET_KEY &&
    process.env.ENGINE_URL &&
    process.env.ENGINE_AUTH_TOKEN &&
    process.env.ENGINE_WALLET_ADDRESS,
)("Engine", () => {
  const engineAcc = engineAccount({
    engineUrl: process.env.ENGINE_URL as string,
    authToken: process.env.ENGINE_AUTH_TOKEN as string,
    walletAddress: process.env.ENGINE_WALLET_ADDRESS as string,
    chain: sepolia,
  });

  it("should sign a message", async () => {
    const signature = await engineAcc.signMessage({
      message: "hello",
    });
    expect(signature).toBeDefined();
  });

  it("should sign typed data", async () => {
    const signature = await engineAcc.signTypedData({
      ...typedData.basic,
    });
    expect(signature).toBeDefined();
  });

  it("should send a tx", async () => {
    const tx = await sendTransaction({
      account: engineAcc,
      transaction: {
        client: TEST_CLIENT,
        chain: sepolia,
        to: TEST_ACCOUNT_B.address,
        value: 0n,
      },
    });
    expect(tx).toBeDefined();
  });

  it("should send a extension tx", async () => {
    const nftContract = getContract({
      client: TEST_CLIENT,
      chain: sepolia,
      address: "0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
    });
    const claimTx = claimTo({
      contract: nftContract,
      to: TEST_ACCOUNT_B.address,
      tokenId: 0n,
      quantity: 1n,
    });
    const tx = await sendTransaction({
      account: engineAcc,
      transaction: claimTx,
    });
    expect(tx).toBeDefined();
  });

  it.skip("should send a session key tx", async () => {
    const personalAccount = await generateAccount({
      client: TEST_CLIENT,
    });
    const smart = smartWallet({
      chain: sepolia,
      sponsorGas: true,
      sessionKey: {
        address: process.env.ENGINE_WALLET_ADDRESS_EOA as string,
        permissions: {
          approvedTargets: "*",
        },
      },
    });
    const smartAccount = await smart.connect({
      client: TEST_CLIENT,
      personalAccount,
    });

    const engineAcc = engineAccount({
      engineUrl: process.env.ENGINE_URL as string,
      authToken: process.env.ENGINE_AUTH_TOKEN as string,
      walletAddress: process.env.ENGINE_WALLET_ADDRESS_EOA as string,
      chain: sepolia,
      overrides: {
        accountAddress: smartAccount.address,
      },
    });
    const tx = await sendTransaction({
      account: engineAcc,
      transaction: {
        client: TEST_CLIENT,
        chain: sepolia,
        to: TEST_ACCOUNT_B.address,
        value: 0n,
      },
    });
    expect(tx).toBeDefined();
  });
});
