import { assertType, describe, expect, test } from "vitest";

import {
  type TransactionSerializable,
  type TransactionSerializableBase,
  type TransactionSerializableEIP1559,
  type TransactionSerializableEIP2930,
  type TransactionSerializableLegacy,
  type TransactionSerializedEIP1559,
  type TransactionSerializedEIP2930,
  type TransactionSerializedLegacy,
  parseTransaction,
} from "viem";

import { checksumAddress } from "../utils/address.js";
import { fromGwei, toWei } from "../utils/units.js";
import { serializeTransaction } from "./serialize-transaction.js";

import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import { sign } from "../utils/signatures/sign.js";

const BASE_TRANSACTION = {
  to: checksumAddress(TEST_ACCOUNT_B.address),
  nonce: 785,
  value: toWei("1"),
} as const satisfies TransactionSerializableBase;

describe("eip1559", () => {
  const baseEip1559 = {
    ...BASE_TRANSACTION,
    chainId: 1,
    maxFeePerGas: fromGwei("2"),
    maxPriorityFeePerGas: fromGwei("2"),
  } as const satisfies TransactionSerializableEIP1559;

  test("default", () => {
    const serialized = serializeTransaction({
      transaction: baseEip1559,
    });
    assertType<TransactionSerializedEIP1559>(serialized);
    expect(serialized).toEqual(
      "0x02ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0",
    );

    const tx = parseTransaction(serialized);
    // The parsed transaction to address is not guaranteed to be checksummed, but our input address is
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...baseEip1559,
      type: "eip1559",
    });
  });

  test("minimal (w/ type)", () => {
    const args = {
      chainId: 1,
      type: "eip1559",
    } as const;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual("0x02c90180808080808080c0");
    expect(parseTransaction(serialized)).toEqual(args);
  });

  test("default (all zeros)", () => {
    const baseEip1559Zero = {
      to: TEST_ACCOUNT_B.address,
      nonce: 0,
      chainId: 1,
      maxFeePerGas: 0n,
      maxPriorityFeePerGas: 0n,
      value: 0n,
    } satisfies TransactionSerializableEIP1559;

    const serialized = serializeTransaction({
      transaction: baseEip1559Zero,
    });

    expect(serialized).toEqual(
      "0x02dd01808080809470997970c51812dc3a010c7d01b50e0d17dc79c88080c0",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      chainId: 1,
      to: TEST_ACCOUNT_B.address,
      type: "eip1559",
    });
  });

  test("minimal (w/ maxFeePerGas)", () => {
    const args = {
      chainId: 1,
      maxFeePerGas: 1n,
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0x02c90180800180808080c0");
    expect(parseTransaction(serialized)).toEqual({ ...args, type: "eip1559" });
  });

  test("args: gas", () => {
    const args = {
      ...baseEip1559,
      gas: 21001n,
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0x02f101820311847735940084773594008252099470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0",
    );
    expect(parseTransaction(serialized).gas).toEqual(args.gas);
  });

  test("args: accessList", () => {
    const args = {
      ...baseEip1559,
      accessList: [
        {
          address: "0x0000000000000000000000000000000000000000",
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          ],
        },
      ],
    } satisfies TransactionSerializableEIP1559;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0x02f88b0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(parseTransaction(serialized).accessList).toEqual(args.accessList);
  });

  test("args: data", () => {
    const args = {
      ...baseEip1559,
      data: "0x1234",
    } satisfies TransactionSerializableEIP1559;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0x02f10182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234c0",
    );
    expect(parseTransaction(serialized).data).toEqual(args.data);
  });

  test("signed", async () => {
    const signature = sign({
      hash: keccak256(serializeTransaction({ transaction: baseEip1559 })),
      privateKey: ANVIL_PKEY_A,
    });
    const serialized = serializeTransaction({
      transaction: {
        ...baseEip1559,
        ...signature,
      },
    });
    expect(serialized).toEqual(
      "0x02f8720182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c001a0ce18214ff9d06ecaacb61811f9d6dc2be922e8cebddeaf6df0b30d5c498f6d33a05f0487c6dbbf2139f7c705d8054dbb16ecac8ae6256ce2c4c6f2e7ef35b3a496",
    );
    expect(parseTransaction(serialized).yParity).toEqual(1);
  });

  test("signature", () => {
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip1559,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 1,
        },
      }),
    ).toEqual(
      "0x02f8720182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip1559,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 0,
        },
      }),
    ).toEqual(
      "0x02f8720182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c080a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip1559,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 0n,
        },
      }),
    ).toEqual(
      "0x02f8720182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c080a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip1559,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 1n,
        },
      }),
    ).toEqual(
      "0x02f8720182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
  });

  describe("errors", () => {
    test("invalid access list (invalid address)", () => {
      expect(() =>
        serializeTransaction({
          transaction: {
            ...baseEip1559,
            accessList: [
              {
                address:
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });

    test("invalid access list (invalid storage key)", () => {
      expect(() =>
        serializeTransaction({
          transaction: {
            ...baseEip1559,
            accessList: [
              {
                address:
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                storageKeys: [
                  "0x00000000000000000000000000000000000000000000000000000000000001",
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });
  });
});

describe("eip2930", () => {
  const BASE_EIP2930_TRANSACTION = {
    ...BASE_TRANSACTION,
    chainId: 1,
    accessList: [
      {
        address: "0x1234512345123451234512345123451234512345",
        storageKeys: [
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ],
      },
    ],
    gasPrice: fromGwei("2"),
  } as const satisfies TransactionSerializableEIP2930;

  test("default", () => {
    const serialized = serializeTransaction({
      transaction: BASE_EIP2930_TRANSACTION,
    });
    assertType<TransactionSerializedEIP2930>(serialized);
    expect(serialized).toEqual(
      "0x01f863018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_EIP2930_TRANSACTION,
      type: "eip2930",
    });
  });

  test("default (all zeros)", () => {
    const baseEip2930Zero = {
      to: checksumAddress(TEST_ACCOUNT_B.address),
      nonce: 0,
      chainId: 1,
      value: 0n,
      gasPrice: 0n,
      accessList: [],
    } satisfies TransactionSerializableEIP2930;

    const serialized = serializeTransaction({
      transaction: baseEip2930Zero,
    });

    expect(serialized).toEqual(
      "0x01dc018080809470997970c51812dc3a010c7d01b50e0d17dc79c88080c0",
    );

    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      chainId: 1,
      to: checksumAddress(TEST_ACCOUNT_B.address),
      type: "eip2930",
    });
  });

  test("minimal (w/ accessList & gasPrice)", () => {
    const args = {
      chainId: 1,
      accessList: [
        {
          address: "0x0000000000000000000000000000000000000000",
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
          ],
        },
      ],
      gasPrice: fromGwei("2"),
    } satisfies TransactionSerializableEIP2930;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0x01f8450180847735940080808080f838f7940000000000000000000000000000000000000000e1a00000000000000000000000000000000000000000000000000000000000000001",
    );
    expect(parseTransaction(serialized).accessList).toEqual(args.accessList);
  });

  test("minimal (w/ type)", () => {
    const args = {
      chainId: 1,
      type: "eip2930",
    } satisfies TransactionSerializableEIP2930;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0x01c801808080808080c0");
    expect(parseTransaction(serialized).type).toEqual("eip2930");
  });

  test("args: gas", () => {
    const args = {
      ...BASE_EIP2930_TRANSACTION,
      gas: 21001n,
    };
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0x01f8650182031184773594008252099470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(parseTransaction(serialized).gas).toEqual(args.gas);
  });

  test("args: data", () => {
    const args = {
      ...BASE_EIP2930_TRANSACTION,
      data: "0x1234",
    } satisfies TransactionSerializableEIP2930;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0x01f865018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(parseTransaction(serialized).data).toEqual(args.data);
  });

  test("signed", async () => {
    const signature = sign({
      hash: keccak256(
        serializeTransaction({ transaction: BASE_EIP2930_TRANSACTION }),
      ),
      privateKey: ANVIL_PKEY_A,
    });
    const serialized = serializeTransaction({
      transaction: { ...BASE_EIP2930_TRANSACTION, ...signature },
    });
    expect(serialized).toEqual(
      "0x01f8a6018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a0dc7b3483c0b183823f07d77247c60678d861080acdc4fb8b9fd131770b475c40a040f16567391132746735aff4d5a3fa5ae42ff3d5d538e341870e0259dc40741a",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_EIP2930_TRANSACTION,
      ...signature,
      type: "eip2930",
      yParity: 1,
    });
  });

  test("signature", () => {
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_EIP2930_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 1,
        },
      }),
    ).toEqual(
      "0x01f8a6018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_EIP2930_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 0,
        },
      }),
    ).toEqual(
      "0x01f8a6018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_EIP2930_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 0n,
        },
      }),
    ).toEqual(
      "0x01f8a6018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_EIP2930_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 1n,
        },
      }),
    ).toEqual(
      "0x01f8a6018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
  });

  describe("errors", () => {
    test("invalid access list (invalid address)", () => {
      expect(() =>
        serializeTransaction({
          transaction: {
            ...BASE_EIP2930_TRANSACTION,
            accessList: [
              {
                address: "0x0",
                storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });

    test("invalid access list (invalid storage key)", () => {
      expect(() =>
        serializeTransaction({
          transaction: {
            ...BASE_EIP2930_TRANSACTION,
            accessList: [
              {
                address: "0x0",
                storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000001",
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });
  });
});

describe("legacy", () => {
  const BASE_LEGACY_TRANSACTION = {
    ...BASE_TRANSACTION,
    gasPrice: fromGwei("2"),
  };

  test("default", () => {
    const serialized = serializeTransaction({
      transaction: BASE_LEGACY_TRANSACTION,
    });
    assertType<TransactionSerializedLegacy>(serialized);
    expect(serialized).toEqual(
      "0xe88203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_LEGACY_TRANSACTION,
      type: "legacy",
    });
  });

  test("default (all zeros)", () => {
    const baseLegacyZero = {
      to: checksumAddress(TEST_ACCOUNT_B.address),
      nonce: 0,
      value: 0n,
      gasPrice: 0n,
    } satisfies TransactionSerializableLegacy;

    const serialized = serializeTransaction({
      transaction: baseLegacyZero,
    });

    expect(serialized).toEqual(
      "0xda8080809470997970c51812dc3a010c7d01b50e0d17dc79c88080",
    );

    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      to: checksumAddress(TEST_ACCOUNT_B.address),
      type: "legacy",
    });
  });

  test("minimal (w/ gasPrice)", () => {
    const args = {
      gasPrice: fromGwei("2"),
    } satisfies TransactionSerializableLegacy;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0xca80847735940080808080");
    expect(parseTransaction(serialized).gasPrice).toEqual(args.gasPrice);
  });

  test("minimal (w/ type)", () => {
    const args = {
      type: "legacy",
    } satisfies TransactionSerializableLegacy;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0xc6808080808080");
    expect(parseTransaction(serialized).type).toEqual(args.type);
  });

  test("args: gas", () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      gas: 21001n,
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0xea82031184773594008252099470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080",
    );
    expect(parseTransaction(serialized).gas).toEqual(args.gas);
  });

  test("args: data", () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      data: "0x1234",
    } satisfies TransactionSerializableLegacy;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0xea8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234",
    );
    expect(parseTransaction(serialized).data).toEqual(args.data);
  });

  test("args: chainId", () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      chainId: 69,
    } satisfies TransactionSerializableLegacy;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0xeb8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080458080",
    );
    expect(parseTransaction(serialized).chainId).toEqual(args.chainId);
  });

  test("signed", async () => {
    const signature = sign({
      hash: keccak256(
        serializeTransaction({ transaction: BASE_LEGACY_TRANSACTION }),
      ),
      privateKey: ANVIL_PKEY_A,
    });
    const serialized = serializeTransaction({
      transaction: { ...BASE_LEGACY_TRANSACTION, ...signature },
    });
    expect(serialized).toEqual(
      "0xf86b8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000801ca06cb0e8d21e5baf998fb9a05f47acd83692dc148f90b81b332a152f020da0ae98a0344e49bacb1ef7af7c2ffed9e88d3f0ae0aa4945c9da0a660a03717dd5621f98",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_LEGACY_TRANSACTION,
      ...signature,
      yParity: 1,
      type: "legacy",
    });
  });

  test("signature", () => {
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_LEGACY_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 28n,
        },
      }),
    ).toEqual(
      "0xf86b8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000801ca060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      serializeTransaction({
        transaction: {
          ...BASE_LEGACY_TRANSACTION,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 27n,
        },
      }),
    ).toEqual(
      "0xf86b8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000801ba060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
  });

  test("signed w/ chainId", async () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      chainId: 69,
    };
    const signature = sign({
      hash: keccak256(serializeTransaction({ transaction: args })),
      privateKey: ANVIL_PKEY_A,
    });
    const serialized = serializeTransaction({
      transaction: { ...args, ...signature },
    });
    expect(serialized).toEqual(
      "0xf86c8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a76400008081ada02f43314322cf4c5dd645b028aa0b0dadff0fb73c41a6f0620ff1dfb11601ac30a066f37a65e139fa4b6df33a42ab5ccaeaa7a109382e7430caefd1deee63962626",
    );
    const tx = parseTransaction(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...args,
      ...signature,
      yParity: 0,
      type: "legacy",
      v: 173n,
    });
  });

  describe("errors", () => {
    test("invalid v", () => {
      expect(() =>
        serializeTransaction({
          transaction: {
            ...BASE_LEGACY_TRANSACTION,
            r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
            s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
            v: 29n,
          },
        }),
      ).toThrow();
    });
  });
});

test("cannot infer type from transaction object", () => {
  expect(() =>
    serializeTransaction({
      transaction: { chainId: 1, data: "0x1234", nonce: 69 },
    }),
  ).toThrow();
});

describe("miscellaneous", () => {
  test("https://github.com/wevm/viem/issues/1433", () => {
    expect(
      serializeTransaction({
        transaction: {
          blockHash: null,
          blockNumber: null,
          from: "0xc702b9950e44f7d321fa16ee88bf8e1a561249ba",
          gas: 51627n,
          gasPrice: 3000000000n,
          hash: "0x3eaa88a766e82cbe53c95218ab4c3cf316325802b5f75d086b5121007b918e92",
          input:
            "0xa9059cbb00000000000000000000000082fc882199816bcec06baf848eaec51c2f96c85b000000000000000000000000000000000000000000000000eccae3078bacd15d",
          nonce: 117,
          to: "0x55d398326f99059ff775485246999027b3197955",
          transactionIndex: null,
          value: 0n,
          type: "legacy",
          v: 84475n,
          r: "0x73b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bf",
          s: "0x354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23",
          chainId: undefined,
          typeHex: "0x0",
        },
      }),
    ).toMatchInlineSnapshot(
      '"0xf8667584b2d05e0082c9ab9455d398326f99059ff775485246999027b31979558080830149fba073b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bfa0354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23"',
    );

    expect(
      serializeTransaction({
        transaction: {
          blockHash: null,
          blockNumber: null,
          from: "0xc702b9950e44f7d321fa16ee88bf8e1a561249ba",
          gas: 51627n,
          gasPrice: 3000000000n,
          hash: "0x3eaa88a766e82cbe53c95218ab4c3cf316325802b5f75d086b5121007b918e92",
          input:
            "0xa9059cbb00000000000000000000000082fc882199816bcec06baf848eaec51c2f96c85b000000000000000000000000000000000000000000000000eccae3078bacd15d",
          nonce: 117,
          to: "0x55d398326f99059ff775485246999027b3197955",
          transactionIndex: null,
          value: 0n,
          type: "legacy",
          v: 84476n,
          r: "0x73b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bf",
          s: "0x354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23",
          chainId: undefined,
          typeHex: "0x0",
        },
      }),
    ).toMatchInlineSnapshot(
      '"0xf8667584b2d05e0082c9ab9455d398326f99059ff775485246999027b31979558080830149fca073b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bfa0354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23"',
    );

    expect(
      serializeTransaction({
        transaction: {
          blockHash: null,
          blockNumber: null,
          from: "0xc702b9950e44f7d321fa16ee88bf8e1a561249ba",
          gas: 51627n,
          gasPrice: 3000000000n,
          hash: "0x3eaa88a766e82cbe53c95218ab4c3cf316325802b5f75d086b5121007b918e92",
          input:
            "0xa9059cbb00000000000000000000000082fc882199816bcec06baf848eaec51c2f96c85b000000000000000000000000000000000000000000000000eccae3078bacd15d",
          nonce: 117,
          to: "0x55d398326f99059ff775485246999027b3197955",
          transactionIndex: null,
          value: 0n,
          type: "legacy",
          v: 35n,
          r: "0x73b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bf",
          s: "0x354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23",
          chainId: undefined,
          typeHex: "0x0",
        },
      }),
    ).toMatchInlineSnapshot(
      '"0xf8637584b2d05e0082c9ab9455d398326f99059ff775485246999027b319795580801ba073b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bfa0354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23"',
    );

    expect(
      serializeTransaction({
        transaction: {
          blockHash: null,
          blockNumber: null,
          from: "0xc702b9950e44f7d321fa16ee88bf8e1a561249ba",
          gas: 51627n,
          gasPrice: 3000000000n,
          hash: "0x3eaa88a766e82cbe53c95218ab4c3cf316325802b5f75d086b5121007b918e92",
          input:
            "0xa9059cbb00000000000000000000000082fc882199816bcec06baf848eaec51c2f96c85b000000000000000000000000000000000000000000000000eccae3078bacd15d",
          nonce: 117,
          to: "0x55d398326f99059ff775485246999027b3197955",
          transactionIndex: null,
          value: 0n,
          type: "legacy",
          v: 36n,
          r: "0x73b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bf",
          s: "0x354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23",
          chainId: undefined,
          typeHex: "0x0",
        },
      }),
    ).toMatchInlineSnapshot(
      '"0xf8637584b2d05e0082c9ab9455d398326f99059ff775485246999027b319795580801ca073b39769ff4a36515c8fca546550a3fdafebbf37fa9e22be2d92b44653ade7bfa0354c756a1aa3346e9b3ea5423ac99acfc005e9cce2cd698e14d792f43fa15a23"',
    );
  });

  test("https://github.com/wevm/viem/issues/1849", async () => {
    const tx = {
      blockHash:
        "0xbfafd5da42c7e715149a1fbcc20c40bcf5f62e013f60af9cdf07c27142b6a0ff",
      blockNumber: 19295009n,
      gas: 421374n,
      gasPrice: 20701311233n,
      input:
        "0x3a2b7b980000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000726000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000065d96f1b00000000000000000000000000000000000000000000000000000000000000030b010c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000c23190af48df1c00000000000000000000000000000000000000000000000000000000000001000000000000000000000000002648f5592c09a260c601acde44e7f8f2944944fb0000000000000000000000000000000000000000000000000f43fc2c04ee000000000000000000000000000000000000000000000000000000c23190af48df1c00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bbe33f57f41a20b2f00dec91dcc1169597f36221f002710c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000023a03a3f85888a471f4effcafa03431511e388560000000000000000000000000000000000000000000000000000000000000000",
      nonce: 38,
      to: "0x2648f5592c09a260c601acde44e7f8f2944944fb",
      transactionIndex: 74,
      value: 57108134443873424n,
      type: "legacy",
      chainId: 1,
      v: 38n,
      r: "0x5abc283bf902f90884f800b2f810febd5e90f8d5077d89e150631bbcc547b7d1",
      s: "0x5acc7718573bcd268256c996f2ae1bdd2bd97019992f44d5806b1cc843cde2e7",
      typeHex: "0x0",
    } as const;

    const serialized = serializeTransaction({
      transaction: { ...tx, data: tx.input },
    });

    expect(keccak256(serialized)).toEqual(
      "0x6ed21df69b02678dfb290ef2a43d490303562eb387f70795766b37bfa9d09bd2",
    );
  });

  test("Successfully handles hex as bigint", () => {
    const transaction = {
      to: "0x0000000000000000000000000000000000000000",
      chainId: 31337,
      data: "0x",
      gas: 21001n,
      nonce: 0,
      accessList: undefined,
      value: "0x0",
      maxFeePerGas: 3100000000n,
      maxPriorityFeePerGas: 1100000000n,
    } as unknown as TransactionSerializable;

    const signed = serializeTransaction({ transaction });
    expect(signed).toMatchInlineSnapshot(
      `"0x02ec827a6980844190ab0084b8c63f008252099400000000000000000000000000000000000000008330783080c0"`,
    );
  });
});
