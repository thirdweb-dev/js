import { fetchDeployMetadata } from "../../utils/any-evm/deploy-metadata.js";

import { beforeAll, describe, expect, it } from "vitest";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { deployContractfromDeployMetadata } from "../prebuilts/deploy-published.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { claimTo } from "./drops/write/claimTo.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getNFT } from "./read/getNFT.js";
import { lazyMint } from "./write/lazyMint.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "CustomDropERC1155",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;

    beforeAll(async () => {
      const customDropDeployMetadata = await fetchDeployMetadata({
        client: TEST_CLIENT,
        uri: "ipfs://QmaqFExXhU8kWkgAZCqxo8F3GZd8D2NJzCJWerfmFjujo8",
      });
      const contractAddress = await deployContractfromDeployMetadata({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_C,
        deployMetadata: customDropDeployMetadata,
        initializeParams: {
          defaultAdmin: TEST_ACCOUNT_C.address,
          name: "TestCustomDropERC1155",
          symbol: "TT",
        },
      });

      contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      // this deploys a contract, it may take some time
    }, 60_000);

    it("should allow for lazy minting tokens", async () => {
      const mintTx = lazyMint({
        contract,
        nfts: [
          { name: "Test NFT" },
          { name: "Test NFT 2" },
          { name: "Test NFT 3" },
          { name: "Test NFT 4" },
          { name: "Test NFT 5" },
          { name: "Test NFT 6" },
        ],
      });
      await sendAndConfirmTransaction({
        transaction: mintTx,
        account: TEST_ACCOUNT_C,
      });

      await expect(nextTokenIdToMint({ contract })).resolves.toBe(6n);
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
            "tokenURI": "ipfs://QmTo68Dm1ntSp2BHLmE9gesS6ELuXosRz5mAgFCK6tfsRk/0",
            "type": "ERC1155",
          }
        `);
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              startTime: new Date(0),
              maxClaimableSupply: 10n,
            },
          ],
          tokenId: 0n,
          singlePhaseDrop: true,
        }),
        account: TEST_ACCOUNT_C,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
        quantity: 1n,
        singlePhaseDrop: true,
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_C,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(1n);
    });

    it("should allow to claim tokens with an allowlist", async () => {
      const tokenId = 1n;
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              overrideList: [
                { address: TEST_ACCOUNT_C.address, maxClaimable: "100" },
                { address: VITALIK_WALLET, maxClaimable: "100" },
              ],
              maxClaimablePerWallet: 0n,
            },
          ],
          tokenId,
          singlePhaseDrop: true,
        }),
        account: TEST_ACCOUNT_C,
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_B.address, tokenId }),
      ).resolves.toBe(0n);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTo({
          contract,
          from: TEST_ACCOUNT_C.address,
          to: TEST_ACCOUNT_B.address,
          tokenId,
          quantity: 1n,
          singlePhaseDrop: true,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_B.address, tokenId }),
      ).resolves.toBe(1n);

      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_B,
          transaction: claimTo({
            contract,
            to: TEST_ACCOUNT_B.address,
            tokenId,
            quantity: 1n,
            singlePhaseDrop: true,
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: Error - !Qty

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);
    });
  },
);
