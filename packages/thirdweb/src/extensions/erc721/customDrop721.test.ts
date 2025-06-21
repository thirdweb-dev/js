import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_C } from "../../../test/src/test-wallets.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { fetchDeployMetadata } from "../../utils/any-evm/deploy-metadata.js";
import { deployContractfromDeployMetadata } from "../prebuilts/deploy-published.js";
import { balanceOf } from "./__generated__/IERC721A/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import { claimTo } from "./drops/write/claimTo.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getNFT } from "./read/getNFT.js";
import { lazyMint } from "./write/lazyMint.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "CustomDropERC721",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;

    beforeAll(async () => {
      const customDropDeployMetadata = await fetchDeployMetadata({
        client: TEST_CLIENT,
        uri: "ipfs://QmY6CHFuhDpQzuv3y3NyQBPdAa7cYjZGJgFeFcw9BfSMQx",
      });
      const contractAddress = await deployContractfromDeployMetadata({
        account: TEST_ACCOUNT_C,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        deployMetadata: customDropDeployMetadata,
        initializeParams: {
          defaultAdmin: TEST_ACCOUNT_C.address,
          name: "TestCustomDropERC721",
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
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address }),
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
        }),
      });
      const claimTx = claimTo({
        contract,
        quantity: 1n,
        singlePhaseDrop: true,
        to: TEST_ACCOUNT_C.address,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address }),
      ).resolves.toBe(1n);
    });
  },
);
