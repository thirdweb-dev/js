import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../exports/transaction.js";
import { getContractMetadata } from "../common/read/getContractMetadata.js";
import { deployERC1155Contract } from "../prebuilts/deploy-erc1155.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { getActiveClaimCondition } from "./drops/read/getActiveClaimCondition.js";
import { claimTo } from "./drops/write/claimTo.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getNFT } from "./read/getNFT.js";
import { lazyMint } from "./write/lazyMint.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "DropERC1155",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;

    beforeAll(async () => {
      const contractAddress = await deployERC1155Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test DropERC1155",
        },
        type: "DropERC1155",
      });

      contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      // this deploys a contract, it may take some time
    }, 60_000);

    describe("Deployment", () => {
      it("should deploy", async () => {
        expect(contract).toBeDefined();
      });
      it("should have the correct name", async () => {
        const metadata = await getContractMetadata({ contract });
        expect(metadata.name).toBe("Test DropERC1155");
      });
    });

    it("should allow for lazy minting tokens", async () => {
      const mintTx = lazyMint({
        contract,
        nfts: [{ name: "Test NFT" }, { name: "Test NFT 2" }],
      });
      await sendAndConfirmTransaction({
        transaction: mintTx,
        account: TEST_ACCOUNT_A,
      });

      await expect(nextTokenIdToMint({ contract })).resolves.toBe(2n);
      await expect(
        getNFT({ contract, tokenId: 0n }),
      ).resolves.toMatchInlineSnapshot(`
      {
        "id": 0n,
        "metadata": {
          "name": "Test NFT",
        },
        "owner": null,
        "supply": 0n,
        "tokenURI": "ipfs://QmWXXPkDuoEGGKdixFMF7asiFNmw323acbRnPAcSbzy2pP/0",
        "type": "ERC1155",
      }
    `);
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 0n }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [{}],
          tokenId: 0n,
        }),
        account: TEST_ACCOUNT_A,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_A.address,
        tokenId: 0n,
        quantity: 1n,
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_A,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address, tokenId: 1n }),
      ).resolves.toBe(0n);
    });

    describe("Allowlists", () => {
      it("should allow to claim tokens with an allowlist", async () => {
        await sendAndConfirmTransaction({
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                allowlist: [
                  { address: TEST_ACCOUNT_A.address, maxClaimable: "100" },
                ],
                maxClaimablePerWallet: 0n,
              },
            ],
            tokenId: 0n,
          }),
          account: TEST_ACCOUNT_A,
        });

        await expect(
          getContractMetadata({ contract }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "merkle": {
              "0x68becb14062ef2d293b9f9d3fa511e0e7ce570d33eb0ca09b12e52332fddec15": "ipfs://QmVhZjSoARnF4cxe8L1tKPhuHHnFZ9RMD6VZr8PmfsPLhi/0",
            },
            "name": "Test DropERC1155",
            "symbol": "",
          }
        `);

        await expect(
          getActiveClaimCondition({ contract, tokenId: 0n }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "maxClaimableSupply": 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
            "merkleRoot": "0x68becb14062ef2d293b9f9d3fa511e0e7ce570d33eb0ca09b12e52332fddec15",
            "metadata": "",
            "pricePerToken": 0n,
            "quantityLimitPerWallet": 0n,
            "startTimestamp": 0n,
            "supplyClaimed": 0n,
          }
        `);

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_A,
            transaction: claimTo({
              contract,
              from: TEST_ACCOUNT_A.address,
              to: TEST_ACCOUNT_B.address,
              tokenId: 0n,
              quantity: 1n,
            }),
          }).catch((err) => {
            console.log(err);
            throw err;
          }),
        ).resolves.toBeDefined();

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_B,
            transaction: claimTo({
              contract,
              to: TEST_ACCOUNT_B.address,
              tokenId: 0n,
              quantity: 1n,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: Error - !Qty

          contract: ${contract.address}
          chainId: 31337]
        `);
      });
    });
  },
);
