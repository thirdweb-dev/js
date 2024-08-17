import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { ANVIL_PKEY_B } from "../../../test/src/test-wallets.js";
import { abstractTestnet } from "../../chains/chain-definitions/abstract-testnet.js";
import { zkSyncSepolia } from "../../chains/chain-definitions/zksync-sepolia.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { privateKeyToAccount } from "../private-key.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;

const chain = zkSyncSepolia;
const client = TEST_CLIENT;

const contract = getContract({
  address: "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77", // edition drop
  chain,
  client,
});

describe.runIf(process.env.TW_SECRET_KEY).skip(
  "SmartWallet zksync tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = privateKeyToAccount({
        client,
        privateKey: ANVIL_PKEY_B,
      });
      wallet = smartWallet({
        chain,
        gasless: true,
      });
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address;
    });

    it("should send a transactions", async () => {
      const tx = await sendTransaction({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      expect(tx.transactionHash.length).toBe(66);
    });

    it.skip("should send a transaction on zkcandy", async () => {
      const zkCandy = defineChain(302);
      const zkCandySmartWallet = smartWallet({
        chain: zkCandy,
        gasless: true,
      });
      const zkCandySmartAccount = await zkCandySmartWallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const zkCandySmartWalletAddress = zkCandySmartAccount.address;
      const preparedTx = await prepareTransaction({
        chain: defineChain(302),
        client: client,
        to: zkCandySmartWalletAddress,
        value: BigInt(0),
        data: "0x",
      });
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: zkCandySmartAccount,
      });
      expect(tx.transactionHash.length).toBe(66);
    });

    it("should send a transaction on abstract", async () => {
      const abstractSmartWallet = smartWallet({
        chain: abstractTestnet,
        gasless: true,
      });
      const account = await abstractSmartWallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const tx = await sendTransaction({
        transaction: claimTo({
          contract: getContract({
            address: "0x8A24a7Df38fA5fCCcFD1259e90Fb6996fDdfcADa", // edition drop
            chain: abstractTestnet,
            client,
          }),
          quantity: 1n,
          to: account.address,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      console.log("tx", tx.transactionHash);
      expect(tx.transactionHash.length).toBe(66);
    });
  },
);
