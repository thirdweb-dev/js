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
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { toEther } from "../../utils/units.js";
import { name } from "../common/read/name.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { canClaim } from "./drops/read/canClaim.js";
import { getClaimConditions } from "./drops/read/getClaimConditions.js";
import { claimTo } from "./drops/write/claimTo.js";
import { resetClaimEligibility } from "./drops/write/resetClaimEligibility.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";
import { getBalance } from "./read/getBalance.js";

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
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          address: contractAddress,
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
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_A.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "0",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 0n,
        }
      `);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [{}],
        }),
        account: TEST_ACCOUNT_A,
      });

      expect(
        await canClaim({
          contract,
          claimer: TEST_ACCOUNT_A.address,
          quantity: "1",
        }),
      ).toMatchInlineSnapshot(`
        {
          "result": true,
        }
      `);
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_A.address,
        quantity: "1",
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_A,
      });
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_A.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "1",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 1000000000000000000n,
        }
      `);
    });

    it("should allow to claim tokens with value", async () => {
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_C.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "0",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 0n,
        }
      `);
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
        quantity: "2",
      });
      // assert value is set correctly
      const value = await resolvePromisedValue(claimTx.value);
      expect(value).toBeDefined();
      if (!value) throw new Error("value is undefined");
      expect(toEther(value)).toBe("0.02");
      // claim
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_C,
      });
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_C.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "2",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 2000000000000000000n,
        }
      `);
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
          getBalance({ contract, address: TEST_ACCOUNT_B.address }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "decimals": 18,
            "displayValue": "0",
            "name": "Test DropERC20",
            "symbol": "",
            "value": 0n,
          }
        `);

        expect(
          await canClaim({
            contract,
            claimer: TEST_ACCOUNT_A.address,
            quantity: "1",
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
            to: TEST_ACCOUNT_B.address,
            quantity: "1",
          }),
        });

        await expect(
          getBalance({ contract, address: TEST_ACCOUNT_B.address }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "decimals": 18,
            "displayValue": "1",
            "name": "Test DropERC20",
            "symbol": "",
            "value": 1000000000000000000n,
          }
        `);

        await expect(
          sendAndConfirmTransaction({
            account: TEST_ACCOUNT_B,
            transaction: claimTo({
              contract,
              to: TEST_ACCOUNT_B.address,
              quantity: "1",
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
          getBalance({ contract, address: TEST_ACCOUNT_A.address }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "decimals": 18,
            "displayValue": "1",
            "name": "Test DropERC20",
            "symbol": "",
            "value": 1000000000000000000n,
          }
        `);

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
              quantity: "2",
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
            to: TEST_ACCOUNT_A.address,
            quantity: "1",
          }),
        });

        await expect(
          getBalance({ contract, address: TEST_ACCOUNT_A.address }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "decimals": 18,
            "displayValue": "2",
            "name": "Test DropERC20",
            "symbol": "",
            "value": 2000000000000000000n,
          }
        `);
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
        getBalance({ contract, address: TEST_ACCOUNT_A.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "2",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 2000000000000000000n,
        }
      `);

      await sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: claimTo({
          contract,
          to: TEST_ACCOUNT_A.address,
          quantity: "1",
        }),
      });

      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_A.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "3",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 3000000000000000000n,
        }
      `);
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
          quantityInWei: 1n,
        }),
        // fresh account to avoid any previous claims
        account: TEST_ACCOUNT_D,
      });
      // check that the account has claimed one token
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_D.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "0.000000000000000001",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 1n,
        }
      `);

      // attempt to claim another token (this should fail)
      await expect(
        sendAndConfirmTransaction({
          transaction: claimTo({
            contract,
            to: TEST_ACCOUNT_D.address,
            quantityInWei: 1n,
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
          quantityInWei: 1n,
        }),
        account: TEST_ACCOUNT_D,
      });
      // check that the account has claimed two tokens
      await expect(
        getBalance({ contract, address: TEST_ACCOUNT_D.address }),
      ).resolves.toMatchInlineSnapshot(`
        {
          "decimals": 18,
          "displayValue": "0.000000000000000002",
          "name": "Test DropERC20",
          "symbol": "",
          "value": 2n,
        }
      `);
    });
  },
);
