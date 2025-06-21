import { beforeAll, describe, expect, it } from "vitest";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../test/src/test-wallets.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { fetchDeployMetadata } from "../../utils/any-evm/deploy-metadata.js";
import { deployContractfromDeployMetadata } from "../prebuilts/deploy-published.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { getClaimConditions } from "./drops/read/getClaimConditions.js";
import { claimTo } from "./drops/write/claimTo.js";
import { resetClaimEligibility } from "./drops/write/resetClaimEligibility.js";
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
        account: TEST_ACCOUNT_C,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
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
        account: TEST_ACCOUNT_C,
        transaction: mintTx,
      });

      await expect(nextTokenIdToMint({ contract })).resolves.toBe(6n);
      expect((await getNFT({ contract, tokenId: 0n })).metadata.name).toBe(
        "Test NFT",
      );
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimableSupply: 10n,
              startTime: new Date(0),
            },
          ],
          singlePhaseDrop: true,
          tokenId: 0n,
        }),
      });

      const condition = await getClaimConditions({
        contract,
        singlePhaseDrop: true,
        tokenId: 0n,
      });
      expect(condition.length).to.eq(1);
      expect(condition[0]?.maxClaimableSupply).to.eq(10n);

      const claimTx = claimTo({
        contract,
        quantity: 1n,
        singlePhaseDrop: true,
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(1n);
    });

    it("should allow to claim tokens with an allowlist", async () => {
      const tokenId = 1n;
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 0n,
              overrideList: [
                { address: TEST_ACCOUNT_C.address, maxClaimable: "100" },
                { address: VITALIK_WALLET, maxClaimable: "100" },
              ],
            },
          ],
          singlePhaseDrop: true,
          tokenId,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_B.address, tokenId }),
      ).resolves.toBe(0n);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTo({
          contract,
          from: TEST_ACCOUNT_C.address,
          quantity: 1n,
          singlePhaseDrop: true,
          to: TEST_ACCOUNT_B.address,
          tokenId,
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
            quantity: 1n,
            singlePhaseDrop: true,
            to: TEST_ACCOUNT_B.address,
            tokenId,
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: Error - !Qty

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);
    });

    it("should reset claim eligibility", async () => {
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 1n,
              maxClaimableSupply: 10n,
              startTime: new Date(0),
            },
          ],
          singlePhaseDrop: true,
          tokenId: 0n,
        }),
      });
      // claim one token
      const claimTx = claimTo({
        contract,
        quantity: 1n,
        singlePhaseDrop: true,
        to: TEST_ACCOUNT_D.address,
        tokenId: 0n,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_D,
        transaction: claimTx,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address, tokenId: 0n }),
      ).resolves.toBe(1n);

      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_D,
          transaction: claimTo({
            contract,
            quantity: 1n,
            to: TEST_ACCOUNT_D.address,
            tokenId: 0n,
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [TransactionError: Error - !Qty

        contract: ${contract.address}
        chainId: ${contract.chain.id}]
      `);

      // reset claim eligibility
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: resetClaimEligibility({
          contract,
          singlePhaseDrop: true,
          tokenId: 0n,
        }),
      });
      // attempt to claim another token (this should succeed)
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_D,
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: TEST_ACCOUNT_D.address,
          tokenId: 0n,
        }),
      });
      // check that the account has claimed two tokens
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address, tokenId: 0n }),
      ).resolves.toBe(2n);
    });
  },
);
