import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { typedData } from "../../test/src/typed-data.js";
import { arbitrumSepolia } from "../chains/chain-definitions/arbitrum-sepolia.js";
import { sepolia } from "../chains/chain-definitions/sepolia.js";
import { getContract } from "../contract/contract.js";
import { setContractURI } from "../extensions/common/__generated__/IContractMetadata/write/setContractURI.js";
import { claimTo } from "../extensions/erc1155/drops/write/claimTo.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { setThirdwebDomains } from "../utils/domains.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  ENTRYPOINT_ADDRESS_v0_6,
} from "../wallets/smart/lib/constants.js";
import { smartWallet } from "../wallets/smart/smart-wallet.js";
import { generateAccount } from "../wallets/utils/generateAccount.js";
import * as Engine from "./index.js";

describe.runIf(
  process.env.TW_SECRET_KEY &&
    process.env.VAULT_TOKEN &&
    process.env.ENGINE_CLOUD_WALLET_ADDRESS &&
    process.env.ENGINE_CLOUD_WALLET_ADDRESS_EOA,
)(
  "Engine Cloud",
  {
    retry: 0,
  },
  () => {
    let serverWallet: Account;

    beforeAll(async () => {
      setThirdwebDomains({
        rpc: "rpc.thirdweb-dev.com",
        storage: "storage.thirdweb-dev.com",
        bundler: "bundler.thirdweb-dev.com",
        engineCloud: "engine-cloud-dev-l8wt.chainsaw-dev.zeet.app",
      });
      serverWallet = Engine.serverWallet({
        client: TEST_CLIENT,
        vaultAccessToken: process.env.VAULT_TOKEN as string,
        walletAddress: process.env.ENGINE_CLOUD_WALLET_ADDRESS as string,
        chain: arbitrumSepolia,
      });
    });

    it("should sign a message", async () => {
      const signature = await serverWallet.signMessage({
        message: "hello",
      });
      expect(signature).toBeDefined();
    });

    it("should sign typed data", async () => {
      const signature = await serverWallet.signTypedData({
        ...typedData.basic,
      });
      expect(signature).toBeDefined();
    });

    it("should send a tx", async () => {
      const tx = await sendTransaction({
        account: serverWallet,
        transaction: {
          client: TEST_CLIENT,
          chain: arbitrumSepolia,
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
        account: serverWallet,
        transaction: claimTx,
      });
      expect(tx).toBeDefined();
    });

    it("should get revert reason", async () => {
      const nftContract = getContract({
        client: TEST_CLIENT,
        chain: sepolia,
        address: "0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
      });
      const transaction = setContractURI({
        contract: nftContract,
        uri: "https://example.com",
        overrides: {
          gas: 1000000n, // skip simulation
        },
      });
      await expect(
        sendTransaction({
          account: serverWallet,
          transaction,
        }),
      ).rejects.toThrow();
    });

    it.only("should send a session key tx", async () => {
      const personalAccount = await generateAccount({
        client: TEST_CLIENT,
      });
      const smart = smartWallet({
        chain: sepolia,
        sponsorGas: true,
        sessionKey: {
          address: process.env.ENGINE_CLOUD_WALLET_ADDRESS_EOA as string,
          permissions: {
            approvedTargets: "*",
          },
        },
      });
      const smartAccount = await smart.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      expect(smartAccount.address).toBeDefined();

      const serverWallet = Engine.serverWallet({
        client: TEST_CLIENT,
        vaultAccessToken: process.env.VAULT_TOKEN as string,
        walletAddress: process.env.ENGINE_CLOUD_WALLET_ADDRESS_EOA as string,
        chain: sepolia,
        executionOptions: {
          type: "ERC4337",
          signerAddress: process.env.ENGINE_CLOUD_WALLET_ADDRESS_EOA as string,
          smartAccountAddress: smartAccount.address,
          entrypointAddress: ENTRYPOINT_ADDRESS_v0_6,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
        },
      });
      const tx = await sendTransaction({
        account: serverWallet,
        transaction: {
          client: TEST_CLIENT,
          chain: sepolia,
          to: TEST_ACCOUNT_B.address,
          value: 0n,
        },
      });
      expect(tx).toBeDefined();
    });
  },
);
