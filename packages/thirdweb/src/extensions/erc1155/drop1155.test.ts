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
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
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
          name: "EditionDrop",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "DropERC1155",
      });

      expect(contractAddress).toBeDefined();
      const deployedName = await name({
        contract: getContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          address: contractAddress,
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
        transaction: mintTx,
        account: TEST_ACCOUNT_C,
      });

      await expect(nextTokenIdToMint({ contract })).resolves.toBe(6n);
      expect((await getNFT({ contract, tokenId: 0n })).metadata.name).toBe(
        "Test NFT",
      );
    });

    it("should update metadata", async () => {
      const updateTx = updateMetadata({
        contract,
        targetTokenId: 0n,
        newMetadata: { name: "Test NFT 1" },
      });
      await sendAndConfirmTransaction({
        transaction: updateTx,
        account: TEST_ACCOUNT_C,
      });
      const token0 = await getNFT({ contract, tokenId: 0n });
      expect(token0.metadata.name).toBe("Test NFT 1");
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [{}],
          tokenId: 0n,
        }),
        account: TEST_ACCOUNT_C,
      });

      expect(
        await canClaim({
          contract,
          claimer: TEST_ACCOUNT_C.address,
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
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
        quantity: 1n,
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_C,
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
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              price: "0.001",
            },
          ],
          tokenId: 0n,
        }),
        account: TEST_ACCOUNT_C,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
        quantity: 1n,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value)).toBe("0.001");
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_C,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId: 0n }),
      ).resolves.toBe(2n);
    });

    describe("Allowlists", () => {
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
          }),
          account: TEST_ACCOUNT_C,
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_B.address, tokenId }),
        ).resolves.toBe(0n);

        expect(
          await canClaim({
            contract,
            claimer: TEST_ACCOUNT_C.address,
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
            contract,
            claimer: TEST_ACCOUNT_B.address,
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
            to: TEST_ACCOUNT_B.address,
            tokenId,
            quantity: 1n,
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
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                overrideList: [
                  { address: TEST_ACCOUNT_C.address, maxClaimable: "1" },
                  { address: VITALIK_WALLET, maxClaimable: "3" },
                ],
                maxClaimablePerWallet: 0n,
              },
            ],
            tokenId,
          }),
          account: TEST_ACCOUNT_C,
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
        ).resolves.toBe(0n);

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_C,
            transaction: claimTo({
              contract,
              to: TEST_ACCOUNT_C.address,
              tokenId,
              quantity: 2n,
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
            to: TEST_ACCOUNT_C.address,
            tokenId,
            quantity: 1n,
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
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              overrideList: [
                {
                  address: TEST_ACCOUNT_C.address,
                  maxClaimable: "10",
                  price: "0",
                },
              ],
              maxClaimablePerWallet: 0n,
              price: "1000",
            },
          ],
          tokenId,
        }),
        account: TEST_ACCOUNT_C,
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
      ).resolves.toBe(0n);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_C.address,
          tokenId,
          quantity: 1n,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_C.address, tokenId }),
      ).resolves.toBe(1n);
    });

    it("should be able to retrieve multiple phases", async () => {
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          tokenId: 5n,
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
        }),
        account: TEST_ACCOUNT_C,
      });

      const phases = await getClaimConditions({ contract, tokenId: 5n });
      expect(phases).toHaveLength(2);
      expect(phases[0]?.quantityLimitPerWallet).toBe(1n);
      expect(phases[1]?.quantityLimitPerWallet).toBe(2n);
    });

    it("should be able to reset claim eligibility", async () => {
      // set claim conditions to only allow one claim
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          tokenId: 6n,
          phases: [
            {
              maxClaimablePerWallet: 1n,
            },
          ],
        }),
        account: TEST_ACCOUNT_C,
      });
      // claim one token
      await sendAndConfirmTransaction({
        transaction: claimTo({
          tokenId: 6n,
          contract,
          // fresh account to avoid any previous claims
          to: TEST_ACCOUNT_D.address,
          quantity: 1n,
        }),
        // fresh account to avoid any previous claims
        account: TEST_ACCOUNT_D,
      });
      // check that the account has claimed one token
      await expect(
        balanceOf({ tokenId: 6n, contract, owner: TEST_ACCOUNT_D.address }),
      ).resolves.toBe(1n);
      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          transaction: claimTo({
            tokenId: 6n,
            contract,
            to: TEST_ACCOUNT_D.address,
            quantity: 1n,
          }),
          account: TEST_ACCOUNT_D,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [TransactionError: DropClaimExceedLimit - 1,2

        contract: ${contract.address}
        chainId: ${contract.chain.id}]
      `);

      // reset claim eligibility
      await sendAndConfirmTransaction({
        transaction: resetClaimEligibility({
          tokenId: 6n,
          contract,
        }),
        account: TEST_ACCOUNT_C,
      });
      // attempt to claim another token (this should succeed)
      await sendAndConfirmTransaction({
        transaction: claimTo({
          tokenId: 6n,
          contract,
          to: TEST_ACCOUNT_D.address,
          quantity: 1n,
        }),
        account: TEST_ACCOUNT_D,
      });
      // check that the account has claimed two tokens
      await expect(
        balanceOf({ tokenId: 6n, contract, owner: TEST_ACCOUNT_D.address }),
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
          recipient: TEST_ACCOUNT_B.address,
          tokenId: 4,
          amount: 5,
        },
        {
          recipient: TEST_ACCOUNT_D.address,
          tokenId: 4,
          amount: 5,
        },
      ];

      const { merkleRoot } = await generateMerkleTreeInfoERC1155({
        contract,
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        snapshot,
      });

      const startTime = new Date();
      const setCC = setClaimConditions({
        contract,
        tokenId: 4n,
        phases: [
          {
            maxClaimableSupply: 100n,
            maxClaimablePerWallet: 5n,
            currencyAddress: NATIVE_TOKEN_ADDRESS,
            price: 0.006,
            startTime,
            merkleRootHash: merkleRoot,
          },
        ],
      });

      await sendAndConfirmTransaction({
        transaction: setCC,
        account: TEST_ACCOUNT_C,
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
