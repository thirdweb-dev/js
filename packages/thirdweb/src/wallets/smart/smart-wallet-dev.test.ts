import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { balanceOf } from "../../extensions/erc1155/__generated__/IERC1155/read/balanceOf.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { deployPublishedContract } from "../../extensions/prebuilts/deploy-published.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Address } from "../../utils/address.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { smartWallet } from "./smart-wallet.js";
let wallet: Wallet;

let smartAccount: Account;
let smartWalletAddress: Address;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = arbitrumSepolia;
const client = TEST_CLIENT;
const contract = getContract({
  client,
  chain,
  address: "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3",
});
describe.runIf(process.env.TW_SECRET_KEY).skip.sequential(
  "SmartWallet dev tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      // setThirdwebDomains({
      //   rpc: "rpc.thirdweb-dev.com",
      //   storage: "storage.thirdweb-dev.com",
      //   bundler: "bundler.thirdweb-dev.com",
      // });
      personalAccount = await generateAccount({
        client,
      });
      wallet = smartWallet({
        chain,
        gasless: true,
      });
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address as Address;
      accountContract = getContract({
        address: smartWalletAddress,
        chain,
        client,
      });
    });

    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
    });

    it("can sign a msg", async () => {
      const signature = await smartAccount.signMessage({
        message: "hello world",
      });
      expect(signature.length).toBeGreaterThan(0);
    });

    it("should send a transaction", async () => {
      const tx = prepareTransaction({
        client,
        chain,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        transaction: tx,
        account: smartAccount,
      });
      expect(receipt.transactionHash).toBeDefined();
    });

    it.skip("can execute a tx", async () => {
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

    it.skip("should deploy a published autofactory contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain,
        account: smartAccount,
        contractId: "DropERC721",
        contractParams: {
          defaultAdmin: smartAccount.address, // defaultAdmin
          name: "test", // name
          symbol: "test", // symbol
          contractURI: "", // contractURI
          trustedForwarders: [], // trustedForwarders
          saleRecipient: smartAccount.address, // saleRecipient
          royaltyRecipient: smartAccount.address, // royaltyRecipient
          royaltyBps: 0n, // royaltyBps
          platformFeeBps: 0n, // platformFeeBps
          platformFeeRecipient: smartAccount.address, // platformFeeRecipient
        },
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });
  },
);
