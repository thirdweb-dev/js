import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { verifySignature } from "../../auth/verifySignature.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { balanceOf } from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOf.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { checkContractWalletSignature } from "../../extensions/erc1271/checkContractWalletSignature.js";
import { estimateGasCost } from "../../transaction/actions/estimate-gas-cost.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../transaction/actions/send-batch-transaction.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { smartWallet } from "../create-wallet.js";
import type { Account } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";

let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = arbitrumSepolia;
const client = TEST_CLIENT;
const contract = getContract({
  client,
  chain,
  address: "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3",
});
const factoryAddress = "0x564cf6453a1b0FF8DB603E92EA4BbD410dea45F3"; // pre 712
const factoryAddressV2 = "0xbf1C9aA4B1A085f7DA890a44E82B0A1289A40052"; // post 712

describe.runIf(process.env.TW_SECRET_KEY)(
  "SmartWallet core tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = await generateAccount({
        client,
      });
      const wallet = smartWallet({
        chain,
        factoryAddress,
        gasless: true,
      });
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address;
      accountContract = getContract({
        address: smartWalletAddress,
        chain,
        client,
      });
    });
    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
    });

    it("can execute a tx", async () => {
      const tx = await sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      expect(tx.transactionHash).toHaveLength(66);
      const isDeployed = await isContractDeployed(accountContract);
      expect(isDeployed).toEqual(true);
      const balance = await balanceOf({
        contract,
        owner: smartWalletAddress,
        tokenId: 0n,
      });
      expect(balance).toEqual(1n);
    });

    it("can estimate a tx", async () => {
      const estimates = await estimateGasCost({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });
      expect(estimates.wei.toString()).not.toBe("0");
    });

    it("can execute a batched tx", async () => {
      const tx = await sendBatchTransaction({
        account: smartAccount,
        transactions: [
          claimTo({
            contract,
            quantity: 1n,
            to: smartWalletAddress,
            tokenId: 0n,
          }),
          claimTo({
            contract,
            quantity: 1n,
            to: smartWalletAddress,
            tokenId: 0n,
          }),
        ],
      });
      expect(tx.transactionHash).toHaveLength(66);
      const balance = await balanceOf({
        contract,
        owner: smartWalletAddress,
        tokenId: 0n,
      });
      expect(balance).toEqual(3n);
    });

    it("can sign and verify 1271 old factory", async () => {
      const message = "hello world";
      const signature = await smartAccount.signMessage({ message });
      const isValidV1 = await verifySignature({
        message,
        signature,
        address: smartWalletAddress,
        chain,
        client,
      });
      expect(isValidV1).toEqual(true);
      const isValidV2 = await checkContractWalletSignature({
        message,
        signature,
        contract: accountContract,
      });
      expect(isValidV2).toEqual(true);
    });

    it("can sign and verify 1271 new factory", async () => {
      const wallet = smartWallet({
        chain,
        factoryAddress: factoryAddressV2,
        gasless: true,
      });
      const newAccount = await wallet.connect({ client, personalAccount });
      const message = "hello world";
      const signature = await newAccount.signMessage({ message });
      const isValidV1 = await verifySignature({
        message,
        signature,
        address: newAccount.address,
        chain,
        client,
      });
      expect(isValidV1).toEqual(true);
      const isValidV2 = await checkContractWalletSignature({
        message,
        signature,
        contract: getContract({
          address: newAccount.address,
          chain,
          client,
        }),
      });
      expect(isValidV2).toEqual(true);
    });
  },
);
