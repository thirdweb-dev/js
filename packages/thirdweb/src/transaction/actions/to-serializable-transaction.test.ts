import { beforeAll, describe, expect, test } from "vitest";

import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { FORKED_ETHEREUM_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { arbitrumSepolia } from "../../chains/chain-definitions/arbitrum-sepolia.js";
import { toWei } from "../../utils/units.js";
import {
  type PreparedTransaction,
  prepareTransaction,
} from "../prepare-transaction.js";
import { serializeTransaction } from "../serialize-transaction.js";
import { toSerializableTransaction } from "./to-serializable-transaction.js";

describe.runIf(process.env.TW_SECRET_KEY)("toSerializableTransaction", () => {
  let transaction: PreparedTransaction;
  beforeAll(() => {
    transaction = prepareTransaction({
      to: TEST_WALLET_B,
      chain: FORKED_ETHEREUM_CHAIN,
      value: toWei("10"),
      client: TEST_CLIENT,
    });
  });

  test("should return a serializable transaction", async () => {
    const serializableTransaction = await toSerializableTransaction({
      transaction,
    });

    expect(serializableTransaction.to).toBe(TEST_WALLET_B);
    expect(serializableTransaction.value).toBe(toWei("10"));
    expect(serializableTransaction.chainId).toBe(1);
  });

  describe("gasPrice override", () => {
    test("should be able to be set", async () => {
      const randomGasPrice = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gasPrice: randomGasPrice,
        },
      });
      expect(serializableTransaction.gasPrice).toBe(randomGasPrice);
    });

    test("should be able to be a promised value", async () => {
      const randomGasPrice = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gasPrice: async () => Promise.resolve(randomGasPrice),
        },
      });
      expect(serializableTransaction.gasPrice).toBe(randomGasPrice);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gasPrice: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  describe("maxFeePerGas override", () => {
    test("should be able to be set", async () => {
      const randomMaxFeePerGas = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxFeePerGas: randomMaxFeePerGas,
        },
      });
      expect(serializableTransaction.maxFeePerGas).toBe(randomMaxFeePerGas);
    });

    test("should be able to be a promised value", async () => {
      const randomMaxFeePerGas = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxFeePerGas: async () => Promise.resolve(randomMaxFeePerGas),
        },
      });
      expect(serializableTransaction.maxFeePerGas).toBe(randomMaxFeePerGas);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxFeePerGas: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  describe("maxPriorityFeePerGas override", () => {
    test("should be able to be set", async () => {
      const randomMaxPriorityFeePerGas = BigInt(
        Math.floor(Math.random() * 1000),
      );
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxPriorityFeePerGas: randomMaxPriorityFeePerGas,
        },
      });
      expect(serializableTransaction.maxPriorityFeePerGas).toBe(
        randomMaxPriorityFeePerGas,
      );
    });

    test("should be able to be a promised value", async () => {
      const randomMaxPriorityFeePerGas = BigInt(
        Math.floor(Math.random() * 1000),
      );
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxPriorityFeePerGas: async () =>
            Promise.resolve(randomMaxPriorityFeePerGas),
        },
      });
      expect(serializableTransaction.maxPriorityFeePerGas).toBe(
        randomMaxPriorityFeePerGas,
      );
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          maxPriorityFeePerGas: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  describe("accessList override", () => {
    test("should be able to be set", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          accessList: [
            {
              address: TEST_WALLET_B,
              storageKeys: [],
            },
          ],
        },
      });
      expect(serializableTransaction.accessList).toEqual([
        {
          address: TEST_WALLET_B,
          storageKeys: [],
        },
      ]);
    });

    test("should be able to be a promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          accessList: async () =>
            Promise.resolve([
              {
                address: TEST_WALLET_B,
                storageKeys: [],
              },
            ]),
        },
      });
      expect(serializableTransaction.accessList).toEqual([
        {
          address: TEST_WALLET_B,
          storageKeys: [],
        },
      ]);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          accessList: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  describe("gas override", () => {
    test("should be able to be set", async () => {
      const randomGas = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas: randomGas,
        },
      });
      expect(serializableTransaction.gas).toBe(randomGas);
    });

    test("should be able to be a promised value", async () => {
      const randomGas = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas: async () => Promise.resolve(randomGas),
        },
      });
      expect(serializableTransaction.gas).toBe(randomGas);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });

    test("should respect a 0 gas value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas: async () => Promise.resolve(0n),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
      expect(serializableTransaction.gas).toBe(0n);
    });
  });

  describe("authorizations", () => {
    test("should be able to be set", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          authorizations: [
            {
              address: TEST_WALLET_B,
              chainId: 1,
              nonce: 420n,
            },
          ],
        },
        from: TEST_ACCOUNT_A,
      });

      expect(serializableTransaction.authorizationList).toMatchInlineSnapshot(`
        [
          {
            "address": "0x0000000000000000000000000000000000000002",
            "chainId": 1,
            "nonce": 420n,
            "r": 106662916142344786844727900295567797819003816901437860515446079683830339692340n,
            "s": 46957778264629617940565302067995657621333912569294987161175737034959018506312n,
            "yParity": 0,
          },
        ]
      `);
    });

    test("should be able to be a promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          authorizations: async () =>
            Promise.resolve([
              {
                address: TEST_WALLET_B,
                chainId: 1,
                nonce: 420n,
              },
            ]),
        },
        from: TEST_ACCOUNT_A,
      });

      expect(serializableTransaction.authorizationList).toMatchInlineSnapshot(`
        [
          {
            "address": "0x0000000000000000000000000000000000000002",
            "chainId": 1,
            "nonce": 420n,
            "r": 106662916142344786844727900295567797819003816901437860515446079683830339692340n,
            "s": 46957778264629617940565302067995657621333912569294987161175737034959018506312n,
            "yParity": 0,
          },
        ]
      `);
    });

    test("should fill in `chainId` and `nonce` for authorizations if none are provided", async () => {
      const tx = await toSerializableTransaction({
        transaction: {
          ...transaction,
          authorizations: [
            {
              address: TEST_WALLET_B,
            },
          ],
        },
        from: TEST_ACCOUNT_A,
      });

      expect(tx.authorizationList?.[0]?.chainId).toBe(transaction.chain.id);
      expect(tx.authorizationList?.[0]?.nonce).toBe(BigInt(tx.nonce ?? 0));
    });

    test("should set `to` to the first authorization address if `to` is not provided for an authorization transaction", async () => {
      const tx = await toSerializableTransaction({
        transaction: {
          ...transaction,
          to: undefined,
          authorizations: [
            {
              address: TEST_WALLET_B,
              chainId: 1,
              nonce: 420n,
            },
          ],
        },
        from: TEST_ACCOUNT_A,
      });

      expect(tx.to).toBe(TEST_WALLET_B);
    });

    test("should throw if no account is provided", async () => {
      await expect(
        toSerializableTransaction({
          transaction: {
            ...transaction,
            authorizations: [
              {
                address: TEST_WALLET_B,
                chainId: 1,
                nonce: 420n,
              },
            ],
          },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [Error: toSerializableTransaction - This transaction has authorizations specified, please provide an account to sign them.]
      `);

      await expect(
        toSerializableTransaction({
          transaction: {
            ...transaction,
            authorizations: [
              {
                address: TEST_WALLET_B,
                chainId: 1,
                nonce: 420n,
              },
            ],
          },
          from: TEST_WALLET_B,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [Error: toSerializableTransaction - This transaction has authorizations specified, please provide an account to sign them.]
      `);
    });
  });

  describe("extraGas override", () => {
    let gas: bigint;
    beforeAll(() => {
      gas = BigInt(Math.floor(Math.random() * 1000));
    });

    test("should be able to be set", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas,
          extraGas: BigInt(50_000),
        },
      });
      expect(serializableTransaction.gas).toBe(gas + BigInt(50_000));
    });

    test("should be able to be a promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas,
          extraGas: () => Promise.resolve(BigInt(50_000)),
        },
      });
      expect(serializableTransaction.gas).toBe(gas + BigInt(50_000));
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          gas,
          extraGas: () => Promise.resolve(undefined),
        },
      });

      expect(serializableTransaction.gas).toBe(gas);
    });
  });

  describe("value override", () => {
    test("should be able to be set", async () => {
      const randomValue = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          value: randomValue,
        },
      });
      expect(serializableTransaction.value).toBe(randomValue);
    });

    test("should be able to be a promised value", async () => {
      const randomValue = BigInt(Math.floor(Math.random() * 1000));
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          value: async () => Promise.resolve(randomValue),
        },
      });
      expect(serializableTransaction.value).toBe(randomValue);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          value: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  describe("nonce override", () => {
    test("should be able to be set to 0", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          nonce: 0,
        },
      });
      expect(serializableTransaction.nonce).toBe(0);
    });

    test("should be able to be set", async () => {
      const randomNonce = Math.floor(Math.random() * 1000);
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          nonce: randomNonce,
        },
      });
      expect(serializableTransaction.nonce).toBe(randomNonce);
    });

    test("should be able to be a promised value", async () => {
      const randomNonce = Math.floor(Math.random() * 1000);
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          nonce: async () => Promise.resolve(randomNonce),
        },
      });
      expect(serializableTransaction.nonce).toBe(randomNonce);
    });

    test("should not be overridden when set to an undefined promised value", async () => {
      const serializableTransaction = await toSerializableTransaction({
        transaction: {
          ...transaction,
          nonce: async () => Promise.resolve(undefined),
        },
      });

      expect(() =>
        serializeTransaction({
          transaction: serializableTransaction,
        }),
      ).not.toThrow();
    });
  });

  // skipping this test for now, it fails when batching eth_estimateGas with eth_maxFeePerGas together on arbitrumSepolia
  // works if you run it individually, but when run in parallel the batching kicks in and it fails
  test("should respect 0 maxPriorityFeePerGas chains", async () => {
    const serializableTransaction = await toSerializableTransaction({
      transaction: prepareTransaction({
        to: TEST_WALLET_B,
        chain: arbitrumSepolia,
        value: 0n,
        client: TEST_CLIENT,
      }),
    });

    // gasPrice should be undefined for arbSepolia which has 0 maxPriorityFeePerGas
    expect(serializableTransaction.gasPrice).toBe(undefined);
  });
});
