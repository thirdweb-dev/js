import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { toEther } from "../../utils/units.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../prebuilts/deploy-erc721.js";
import { balanceOf } from "./__generated__/IERC721A/read/balanceOf.js";
import { nextTokenIdToMint } from "./__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import { getClaimConditions } from "./drops/read/getClaimConditions.js";
import { claimTo } from "./drops/write/claimTo.js";
import { resetClaimEligibility } from "./drops/write/resetClaimEligibility.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getNFT } from "./read/getNFT.js";
import { lazyMint } from "./write/lazyMint.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "DropERC721",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;
    let erc20Contract: ThirdwebContract;

    beforeAll(async () => {
      const contractAddress = await deployERC721Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test DropERC721",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "DropERC721",
      });

      const erc20ContractAddress = await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test ERC20",
          contractURI: TEST_CONTRACT_URI,
        },
        type: "TokenERC20",
      });

      erc20Contract = getContract({
        address: erc20ContractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      // this deploys a contract, it may take some time
    }, 120_000);

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
          { name: "Test NFT 7" },
          { name: "Test NFT 8" },
          { name: "Test NFT 9" },
          { name: "Test NFT 10" },
        ],
      });
      await sendAndConfirmTransaction({
        transaction: mintTx,
        account: TEST_ACCOUNT_A,
      });

      await expect(nextTokenIdToMint({ contract })).resolves.toBe(10n);
      await expect(
        getNFT({ contract, tokenId: 0n }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "id": 0n,
          "metadata": {
            "name": "Test NFT",
          },
          "owner": null,
          "tokenURI": "ipfs://QmY1Rr4C7cYVPAaXykMMxg3AVbatDZ6Rd7u3gzt79CiDSB/0",
          "type": "ERC721",
        }
      `);
    });

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [{}],
        }),
        account: TEST_ACCOUNT_A,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_A.address,
        quantity: 1n,
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_A,
      });
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
      ).resolves.toBe(1n);
    });

    it("should allow to claim tokens with value", async () => {
      // set cc with price
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              price: "0.01",
            },
          ],
        }),
        account: TEST_ACCOUNT_A,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_C.address,
        quantity: 2n,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value)).toBe("0.02");
    });

    it("should allow to claim tokens with erc20 value", async () => {
      // set cc with price
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              price: "0.01",
              currencyAddress: erc20Contract.address,
            },
          ],
        }),
        account: TEST_ACCOUNT_A,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_C.address,
        quantity: 2n,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.erc20Value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value.amountWei)).toBe("0.02");
    });

    describe("Allowlists", () => {
      it("should allow to claim tokens with an allowlist", async () => {
        await sendAndConfirmTransaction({
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                overrideList: [
                  { address: TEST_ACCOUNT_A.address, maxClaimable: "100" },
                  { address: VITALIK_WALLET, maxClaimable: "100" },
                ],
                maxClaimablePerWallet: 0n,
              },
            ],
          }),
          account: TEST_ACCOUNT_A,
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_B.address }),
        ).resolves.toBe(0n);

        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_A,
          transaction: claimTo({
            contract,
            from: TEST_ACCOUNT_A.address,
            to: TEST_ACCOUNT_B.address,
            quantity: 1n,
          }),
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_B.address }),
        ).resolves.toBe(1n);

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_B,
            transaction: claimTo({
              contract,
              to: TEST_ACCOUNT_B.address,
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
        await sendAndConfirmTransaction({
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                overrideList: [
                  { address: TEST_ACCOUNT_A.address, maxClaimable: "3" },
                  { address: VITALIK_WALLET, maxClaimable: "3" },
                ],
                maxClaimablePerWallet: 0n,
              },
            ],
          }),
          account: TEST_ACCOUNT_A,
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
        ).resolves.toBe(1n);

        // we try to claim an extra `2` tokens
        // this should faile bcause the max claimable is `3` and we have previously already claimed 2 tokens (one for ourselves, one for the other wallet)
        // NOTE: this relies on the previous tests, we should extract this and properly re-set tests every time
        // this probably requires re-deploying contracts for every test => clean slate
        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_A,
            transaction: claimTo({
              contract,
              to: TEST_ACCOUNT_A.address,
              quantity: 2n,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: DropClaimExceedLimit - 3,4

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);

        // we now try to claim just ONE more token
        // this should work because we have only claimed `2` tokens so far (one for ourselves, one for the other wallet)
        // this should work because the max claimable is `3` and so we **can** claim `1` more token
        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_A,
          transaction: claimTo({
            contract,
            to: TEST_ACCOUNT_A.address,
            quantity: 1n,
          }),
        });

        await expect(
          balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
        ).resolves.toBe(2n);
      });
    });

    it("should respect price", async () => {
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              overrideList: [
                {
                  address: TEST_ACCOUNT_A.address,
                  maxClaimable: "10",
                  price: "0",
                },
              ],
              maxClaimablePerWallet: 0n,
              price: "1000",
            },
          ],
        }),
        account: TEST_ACCOUNT_A,
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
      ).resolves.toBe(2n);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_A.address,
          quantity: 1n,
        }),
      });

      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_A.address }),
      ).resolves.toBe(3n);
    });

    it("should be able to retrieve multiple phases", async () => {
      await sendAndConfirmTransaction({
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
        }),
        account: TEST_ACCOUNT_A,
      });

      const phases = await getClaimConditions({ contract });
      expect(phases).toHaveLength(2);
      expect(phases[0]?.quantityLimitPerWallet).toBe(1n);
      expect(phases[1]?.quantityLimitPerWallet).toBe(2n);
    });

    it("should be able to reset claim eligibility", async () => {
      // set claim conditions to only allow one claim
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 1n,
            },
          ],
        }),
        account: TEST_ACCOUNT_A,
      });
      // claim one token
      await sendAndConfirmTransaction({
        transaction: claimTo({
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
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address }),
      ).resolves.toBe(1n);
      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          transaction: claimTo({
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
          contract,
        }),
        account: TEST_ACCOUNT_A,
      });
      // attempt to claim another token (this should succeed)
      await sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_D.address,
          quantity: 1n,
        }),
        account: TEST_ACCOUNT_D,
      });
      // check that the account has claimed two tokens
      await expect(
        balanceOf({ contract, owner: TEST_ACCOUNT_D.address }),
      ).resolves.toBe(2n);
    });
  },
);
