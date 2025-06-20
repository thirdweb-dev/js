import { type Abi, toFunctionSelector } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../test/src/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { toEther } from "../../utils/units.js";
import { generateMerkleTreeInfoERC1155 } from "../airdrop/write/merkleInfoERC1155.js";
import { name } from "../common/read/name.js";
import { deployERC1155Contract } from "../prebuilts/deploy-erc1155.js";
import { balanceOf } from "./__generated__/IERC1155/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { canClaim } from "./drops/read/canClaim.js";
import { getActiveClaimCondition } from "./drops/read/getActiveClaimCondition.js";
import { getClaimConditions } from "./drops/read/getClaimConditions.js";
import { claimTo } from "./drops/write/claimTo.js";
import { resetClaimEligibility } from "./drops/write/resetClaimEligibility.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { updateMetadata } from "./drops/write/updateMetadata.js";
import { getNFT } from "./read/getNFT.js";
import { isGetNFTsSupported } from "./read/getNFTs.js";
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
        account: TEST_ACCOUNT_C,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: TEST_CONTRACT_URI,
          name: "EditionDrop",
        },
        type: "DropERC1155",
      });

      expect(contractAddress).toBeDefined();
      const deployedName = await name({
        contract: getContract({
          address: contractAddress,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
        }),
      });
      expect(deployedName).toBe("EditionDrop");

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

    it("should update metadata", async () => {
      const updateTx = updateMetadata({
        contract,
        newMetadata: { name: "Test NFT 1" },
        targetTokenId: 0n,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: updateTx,
      });
      const token0 = await getNFT({ contract, tokenId: 0n });
      expect(token0.metadata.name).toBe("Test NFT 1");
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [{}],
          tokenId: 0n,
        }),
      });

      expect(
        await canClaim({
          claimer: TEST_ACCOUNT_C.address,
          contract,
          quantity: 1n,
          tokenId: 0n,
        }),
      ).toMatchInlineSnapshot(`
        {
          "result": true,
        }
      `);

      const claimTx = claimTo({
        contract,
        quantity: 1n,
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

    it("should allow to claim tokens with price", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(1n);
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              price: "0.001",
            },
          ],
          tokenId: 0n,
        }),
      });
      const claimTx = claimTo({
        contract,
        quantity: 1n,
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value)).toBe("0.001");
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(2n);
    });

    describe("Allowlists", () => {
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
            tokenId,
          }),
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_B.address, tokenId }),
        ).resolves.toBe(0n);

        expect(
          await canClaim({
            claimer: TEST_ACCOUNT_C.address,
            contract,
            quantity: 1n,
            tokenId,
          }),
        ).toMatchInlineSnapshot(`
          {
            "result": true,
          }
        `);

        expect(
          await canClaim({
            claimer: TEST_ACCOUNT_B.address,
            contract,
            quantity: 1n,
            tokenId,
          }),
        ).toMatchInlineSnapshot(`
          {
            "reason": "DropClaimExceedLimit - 0,1",
            "result": false,
          }
        `);

        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_C,
          transaction: claimTo({
            contract,
            from: TEST_ACCOUNT_C.address,
            quantity: 1n,
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
              to: TEST_ACCOUNT_B.address,
              tokenId,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: DropClaimExceedLimit - 0,1

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);
      });

      it("should respect max claimable", async () => {
        const tokenId = 2n;
        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_C,
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                maxClaimablePerWallet: 0n,
                overrideList: [
                  { address: TEST_ACCOUNT_C.address, maxClaimable: "1" },
                  { address: VITALIK_WALLET, maxClaimable: "3" },
                ],
              },
            ],
            tokenId,
          }),
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
        ).resolves.toBe(0n);

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_C,
            transaction: claimTo({
              contract,
              quantity: 2n,
              to: TEST_ACCOUNT_C.address,
              tokenId,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: DropClaimExceedLimit - 1,2

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);

        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_C,
          transaction: claimTo({
            contract,
            quantity: 1n,
            to: TEST_ACCOUNT_C.address,
            tokenId,
          }),
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
        ).resolves.toBe(1n);
      });
    });

    it("should respect price", async () => {
      const tokenId = 3n;
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 0n,
              overrideList: [
                {
                  address: TEST_ACCOUNT_C.address,
                  maxClaimable: "10",
                  price: "0",
                },
              ],
              price: "1000",
            },
          ],
          tokenId,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
      ).resolves.toBe(0n);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: TEST_ACCOUNT_C.address,
          tokenId,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
      ).resolves.toBe(1n);
    });

    it("should be able to retrieve multiple phases", async () => {
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 1n,
              startTime: new Date(0),
            },
            {
              maxClaimablePerWallet: 2n,
              startTime: new Date(),
            },
          ],
          tokenId: 5n,
        }),
      });

      const phases = await getClaimConditions({ contract, tokenId: 5n });
      expect(phases).toHaveLength(2);
      expect(phases[0]?.quantityLimitPerWallet).toBe(1n);
      expect(phases[1]?.quantityLimitPerWallet).toBe(2n);
    });

    it("should be able to reset claim eligibility", async () => {
      // set claim conditions to only allow one claim
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 1n,
            },
          ],
          tokenId: 6n,
        }),
      });
      // claim one token
      await sendAndConfirmTransaction({
        // fresh account to avoid any previous claims
        account: TEST_ACCOUNT_D,
        transaction: claimTo({
          contract,
          quantity: 1n,
          // fresh account to avoid any previous claims
          to: TEST_ACCOUNT_D.address,
          tokenId: 6n,
        }),
      });
      // check that the account has claimed one token
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address, tokenId: 6n }),
      ).resolves.toBe(1n);
      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_D,
          transaction: claimTo({
            contract,
            quantity: 1n,
            to: TEST_ACCOUNT_D.address,
            tokenId: 6n,
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [TransactionError: DropClaimExceedLimit - 1,2

        contract: ${contract.address}
        chainId: ${contract.chain.id}]
      `);

      // reset claim eligibility
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: resetClaimEligibility({
          contract,
          tokenId: 6n,
        }),
      });
      // attempt to claim another token (this should succeed)
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_D,
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: TEST_ACCOUNT_D.address,
          tokenId: 6n,
        }),
      });
      // check that the account has claimed two tokens
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address, tokenId: 6n }),
      ).resolves.toBe(2n);
    });

    it("isGetNFTsSupported should work with our Edition Drop contracts", async () => {
      const abi = await resolveContractAbi<Abi>(contract);
      const selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
      expect(isGetNFTsSupported(selectors)).toBe(true);
    });

    it("getActiveClaimCondition should work", async () => {
      // Create a public allowlist claim phase
      const snapshot = [
        {
          amount: 5,
          recipient: TEST_ACCOUNT_B.address,
          tokenId: 4,
        },
        {
          amount: 5,
          recipient: TEST_ACCOUNT_D.address,
          tokenId: 4,
        },
      ];

      const { merkleRoot } = await generateMerkleTreeInfoERC1155({
        contract,
        snapshot,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
      });

      const startTime = new Date();
      const setCC = setClaimConditions({
        contract,
        phases: [
          {
            currencyAddress: NATIVE_TOKEN_ADDRESS,
            maxClaimablePerWallet: 5n,
            maxClaimableSupply: 100n,
            merkleRootHash: merkleRoot,
            price: 0.006,
            startTime,
          },
        ],
        tokenId: 4n,
      });

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: setCC,
      });

      const activeCC = await getActiveClaimCondition({ contract, tokenId: 4n });
      expect(activeCC.currency.toLowerCase()).toBe(
        NATIVE_TOKEN_ADDRESS.toLowerCase(),
      );
      expect(activeCC.merkleRoot).toBe(
        "0x5baa4423af7125448ad7ca6913cdee7dd952a8d10a44f4fad4c50eea65c5c92d",
      );
      expect(activeCC.pricePerToken).toBe(6000000000000000n);
      expect(activeCC.quantityLimitPerWallet).toBe(5n);
    });
  },
);
