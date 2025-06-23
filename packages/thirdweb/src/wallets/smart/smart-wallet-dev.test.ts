import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
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
  address: "0x6A7a26c9a595E6893C255C9dF0b593e77518e0c3",
  chain,
  client,
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
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        account: smartAccount,
        transaction: tx,
      });
      expect(receipt.transactionHash).toBeDefined();
    });

    it.skip("can execute a tx", async () => {
      const tx = await sendAndConfirmTransaction({
        account: smartAccount,
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
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
        account: smartAccount,
        chain,
        client: TEST_CLIENT,
        contractId: "DropERC721",
        contractParams: {
          contractURI: "", // defaultAdmin
          defaultAdmin: smartAccount.address, // name
          name: "test", // symbol
          platformFeeBps: 0n, // contractURI
          platformFeeRecipient: smartAccount.address, // trustedForwarders
          royaltyBps: 0n, // saleRecipient
          royaltyRecipient: smartAccount.address, // royaltyRecipient
          saleRecipient: smartAccount.address, // royaltyBps
          symbol: "test", // platformFeeBps
          trustedForwarders: [], // platformFeeRecipient
        },
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });
  },
);
