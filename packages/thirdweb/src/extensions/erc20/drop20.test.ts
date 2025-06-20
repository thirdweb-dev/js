import { beforeAll, describe, expect, it } from "vitest";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "../../../test/src/test-wallets.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { toEther, toWei } from "../../utils/units.js";
import { name } from "../common/read/name.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { canClaim } from "./drops/read/canClaim.js";
import { getClaimConditions } from "./drops/read/getClaimConditions.js";
import { claimTo } from "./drops/write/claimTo.js";
import { resetClaimEligibility } from "./drops/write/resetClaimEligibility.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getBalance } from "./read/getBalance.js";
import { getApprovalForTransaction } from "./write/getApprovalForTransaction.js";
import { mintTo } from "./write/mintTo.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "DropERC20",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;

    beforeAll(async () => {
      const contractAddress = await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test DropERC20",
        },
        type: "DropERC20",
      });

      expect(contractAddress).toBeDefined();
      const deployedName = await name({
        contract: getContract({
          address: contractAddress,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
        }),
      });
      expect(deployedName).toBe("Test DropERC20");

      contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      // this deploys a contract, it may take some time
    }, 60_000);

    it("should allow to claim tokens", async () => {
      expect(
        (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
          .displayValue,
      ).toBe("0");
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: setClaimConditions({
          contract,
          phases: [{}],
        }),
      });

      expect(
        await canClaim({
          claimer: TEST_ACCOUNT_A.address,
          contract,
          quantity: "1",
        }),
      ).toMatchInlineSnapshot(`
        {
          "result": true,
        }
      `);
      const claimTx = claimTo({
        contract,
        quantity: "1",
        to: TEST_ACCOUNT_A.address,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: claimTx,
      });
      expect(
        (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
          .displayValue,
      ).toBe("1");
    });

    it("should allow to claim tokens with value", async () => {
      expect(
        (await getBalance({ address: TEST_ACCOUNT_C.address, contract }))
          .displayValue,
      ).toBe("0");
      // set cc with price
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              price: "0.01",
            },
          ],
        }),
      });
      const claimTx = claimTo({
        contract,
        quantity: "2",
        to: TEST_ACCOUNT_C.address,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value)).toBe("0.02");
      // claim
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      expect(
        (await getBalance({ address: TEST_ACCOUNT_C.address, contract }))
          .displayValue,
      ).toBe("2");
    });

    it("should allow to claim tokens with erc20 price", async () => {
      expect(
        (await getBalance({ address: TEST_ACCOUNT_C.address, contract }))
          .displayValue,
      ).toBe("2");
      const erc20ContractAddres = await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test DropERC20",
        },
        type: "TokenERC20",
      });
      const erc20Contract = getContract({
        address: erc20ContractAddres,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      const mintToTx = mintTo({
        amount: "0.02",
        contract: erc20Contract,
        to: TEST_ACCOUNT_C.address,
      });
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: mintToTx,
      });
      expect(
        (
          await getBalance({
            address: TEST_ACCOUNT_C.address,
            contract: erc20Contract,
          })
        ).displayValue,
      ).toBe("0.02");
      // set cc with price
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              currencyAddress: erc20ContractAddres,
              price: "0.01",
            },
          ],
        }),
      });
      const claimTx = claimTo({
        contract,
        quantity: "2",
        to: TEST_ACCOUNT_C.address,
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.erc20Value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(value.amountWei).toBe(toWei("0.02"));
      const approve = await getApprovalForTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      if (approve) {
        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_C,
          transaction: approve,
        });
      }
      // claim
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: claimTx,
      });
      expect(
        (await getBalance({ address: TEST_ACCOUNT_C.address, contract }))
          .displayValue,
      ).toBe("4");
      expect(
        (
          await getBalance({
            address: TEST_ACCOUNT_C.address,
            contract: erc20Contract,
          })
        ).displayValue,
      ).toBe("0");
    });

    describe("Allowlists", () => {
      it("should allow to claim tokens with an allowlist", async () => {
        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_A,
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                maxClaimablePerWallet: 0n,
                overrideList: [
                  { address: TEST_ACCOUNT_A.address, maxClaimable: "100" },
                  { address: VITALIK_WALLET, maxClaimable: "100" },
                ],
              },
            ],
          }),
        });

        expect(
          (await getBalance({ address: TEST_ACCOUNT_B.address, contract }))
            .displayValue,
        ).toBe("0");

        expect(
          await canClaim({
            claimer: TEST_ACCOUNT_A.address,
            contract,
            quantity: "1",
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
            quantity: "1",
          }),
        ).toMatchInlineSnapshot(`
          {
            "reason": "DropClaimExceedLimit - 0,1000000000000000000",
            "result": false,
          }
        `);

        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_A,
          transaction: claimTo({
            contract,
            from: TEST_ACCOUNT_A.address,
            quantity: "1",
            to: TEST_ACCOUNT_B.address,
          }),
        });

        expect(
          (await getBalance({ address: TEST_ACCOUNT_B.address, contract }))
            .displayValue,
        ).toBe("1");

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_B,
            transaction: claimTo({
              contract,
              quantity: "1",
              to: TEST_ACCOUNT_B.address,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: DropClaimExceedLimit - 0,1000000000000000000

          contract: ${contract.address}
          chainId: ${contract.chain.id}]
        `);
      });

      it("should respect max claimable", async () => {
        await sendAndConfirmTransaction({
          account: TEST_ACCOUNT_A,
          transaction: setClaimConditions({
            contract,
            phases: [
              {
                maxClaimablePerWallet: 0n,
                overrideList: [
                  { address: TEST_ACCOUNT_A.address, maxClaimable: "3" },
                  { address: VITALIK_WALLET, maxClaimable: "3" },
                ],
              },
            ],
          }),
        });

        expect(
          (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
            .displayValue,
        ).toBe("1");

        // we try to claim an extra `2` tokens
        // this should faile bcause the max claimable is `3` and we have previously already claimed 2 tokens (one for ourselves, one for the other wallet)
        // NOTE: this relies on the previous tests, we should extract this and properly re-set tests every time
        // this probably requires re-deploying contracts for every test => clean slate
        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_A,
            transaction: claimTo({
              contract,
              quantity: "2",
              to: TEST_ACCOUNT_A.address,
            }),
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [TransactionError: DropClaimExceedLimit - 3000000000000000000,4000000000000000000

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
            quantity: "1",
            to: TEST_ACCOUNT_A.address,
          }),
        });

        expect(
          (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
            .displayValue,
        ).toBe("2");
      });
    });

    it("should respect price", async () => {
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 0n,
              overrideList: [
                {
                  address: TEST_ACCOUNT_A.address,
                  maxClaimable: "10",
                  price: "0",
                },
              ],
              price: "1000",
            },
          ],
        }),
      });

      expect(
        (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
          .displayValue,
      ).toBe("2");

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: claimTo({
          contract,
          quantity: "1",
          to: TEST_ACCOUNT_A.address,
        }),
      });

      expect(
        (await getBalance({ address: TEST_ACCOUNT_A.address, contract }))
          .displayValue,
      ).toBe("3");
    });

    it("should be able to retrieve multiple phases", async () => {
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
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
      });

      const phases = await getClaimConditions({ contract });
      expect(phases).toHaveLength(2);
      expect(phases[0]?.quantityLimitPerWallet).toBe(1n);
      expect(phases[1]?.quantityLimitPerWallet).toBe(2n);
    });

    it("should be able to reset claim eligibility", async () => {
      // set claim conditions to only allow one claim
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              maxClaimablePerWallet: 1n,
            },
          ],
        }),
      });
      // claim one token
      await sendAndConfirmTransaction({
        // fresh account to avoid any previous claims
        account: TEST_ACCOUNT_D,
        transaction: claimTo({
          contract,
          quantityInWei: 1n,
          // fresh account to avoid any previous claims
          to: TEST_ACCOUNT_D.address,
        }),
      });
      // check that the account has claimed one token
      expect(
        (await getBalance({ address: TEST_ACCOUNT_D.address, contract }))
          .displayValue,
      ).toBe("0.000000000000000001");

      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          account: TEST_ACCOUNT_D,
          transaction: claimTo({
            contract,
            quantityInWei: 1n,
            to: TEST_ACCOUNT_D.address,
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [TransactionError: DropClaimExceedLimit - 1,2

        contract: ${contract.address}
        chainId: ${contract.chain.id}]
      `);

      // reset claim eligibility
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: resetClaimEligibility({
          contract,
        }),
      });
      // attempt to claim another token (this should succeed)
      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_D,
        transaction: claimTo({
          contract,
          quantityInWei: 1n,
          to: TEST_ACCOUNT_D.address,
        }),
      });
      // check that the account has claimed two tokens
      expect(
        (await getBalance({ address: TEST_ACCOUNT_D.address, contract }))
          .displayValue,
      ).toBe("0.000000000000000002");
    });
  },
);
