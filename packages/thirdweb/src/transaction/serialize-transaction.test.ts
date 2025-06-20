import * as ox__Hex from "ox/Hex";
import * as ox__TransactionEnvelopeEip1559 from "ox/TransactionEnvelopeEip1559";
import * as ox__TransactionEnvelopeEip2930 from "ox/TransactionEnvelopeEip2930";
import * as ox__TransactionEnvelopeEip7702 from "ox/TransactionEnvelopeEip7702";
import * as ox__TransactionEnvelopeLegacy from "ox/TransactionEnvelopeLegacy";
import { assertType, describe, expect, test } from "vitest";
import { wagmiTokenContractConfig } from "../../test/src/abis/wagmiToken.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { type Address, checksumAddress } from "../utils/address.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import { sign } from "../utils/signatures/sign.js";
import { fromGwei, toWei } from "../utils/units.js";
import { serializeTransaction } from "./serialize-transaction.js";

const BASE_TRANSACTION = {
  nonce: 785,
  to: checksumAddress(TEST_ACCOUNT_B.address),
  value: toWei("1"),
} as const;

describe.runIf(process.env.TW_SECRET_KEY)("eip1559", () => {
  const baseEip1559 = {
    ...BASE_TRANSACTION,
    chainId: 1,
    maxFeePerGas: fromGwei("2"),
    maxPriorityFeePerGas: fromGwei("2"),
  } as const;

  test("default", () => {
    const serialized = serializeTransaction({
      transaction: baseEip1559,
    });
    expect(serialized).toEqual(
      "0x02ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0",
    );

    const tx = ox__TransactionEnvelopeEip1559.deserialize(
      serialized as ox__TransactionEnvelopeEip1559.Serialized,
    );
    // The parsed transaction to address is not guaranteed to be checksummed, but our input address is
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...baseEip1559,
      nonce: BigInt(baseEip1559.nonce),
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

    const tx = ox__TransactionEnvelopeEip1559.deserialize(
      serialized as ox__TransactionEnvelopeEip1559.Serialized,
    );
    expect(tx).toEqual(args);
  });

  test("default (all zeros)", () => {
    const baseEip1559Zero = {
      chainId: 1,
      maxFeePerGas: 0n,
      maxPriorityFeePerGas: 0n,
      nonce: 0,
      to: TEST_ACCOUNT_B.address as Address,
      value: 0n,
    };

    const serialized = serializeTransaction({
      transaction: baseEip1559Zero,
    });

    expect(serialized).toEqual(
      "0x02dd01808080809470997970c51812dc3a010c7d01b50e0d17dc79c88080c0",
    );
    const tx = ox__TransactionEnvelopeEip1559.deserialize(
      serialized as ox__TransactionEnvelopeEip1559.Serialized,
    );
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
    expect(
      ox__TransactionEnvelopeEip1559.deserialize(
        serialized as ox__TransactionEnvelopeEip1559.Serialized,
      ),
    ).toEqual({
      ...args,
      type: "eip1559",
    });
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
    expect(
      ox__TransactionEnvelopeEip1559.deserialize(
        serialized as ox__TransactionEnvelopeEip1559.Serialized,
      ).gas,
    ).toEqual(args.gas);
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
          ] as const,
        },
      ],
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0x02f88b0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      ox__TransactionEnvelopeEip1559.deserialize(
        serialized as ox__TransactionEnvelopeEip1559.Serialized,
      ).accessList,
    ).toEqual(args.accessList);
  });

  test("args: data", () => {
    const args = {
      ...baseEip1559,
      data: "0x1234",
    } as const;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0x02f10182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234c0",
    );
    expect(
      ox__TransactionEnvelopeEip1559.deserialize(
        serialized as ox__TransactionEnvelopeEip1559.Serialized,
      ).data,
    ).toEqual(args.data);
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
    expect(
      ox__TransactionEnvelopeEip1559.deserialize(
        serialized as ox__TransactionEnvelopeEip1559.Serialized,
      ).yParity,
    ).toEqual(1);
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
    accessList: [
      {
        address: "0x1234512345123451234512345123451234512345",
        storageKeys: [
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ],
      },
    ],
    chainId: 1,
    gasPrice: fromGwei("2"),
  } as const;

  test("default", () => {
    const serialized = serializeTransaction({
      transaction: BASE_EIP2930_TRANSACTION,
    });
    expect(serialized).toEqual(
      "0x01f863018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    const tx = ox__TransactionEnvelopeEip2930.deserialize(
      serialized as ox__TransactionEnvelopeEip2930.Serialized,
    );
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_EIP2930_TRANSACTION,
      nonce: BigInt(BASE_EIP2930_TRANSACTION.nonce),
      type: "eip2930",
    });
  });

  test("default (all zeros)", () => {
    const baseEip2930Zero = {
      accessList: [],
      chainId: 1,
      gasPrice: 0n,
      nonce: 0,
      to: checksumAddress(TEST_ACCOUNT_B.address),
      value: 0n,
    };

    const serialized = serializeTransaction({
      transaction: baseEip2930Zero,
    });

    expect(serialized).toEqual(
      "0x01dc018080809470997970c51812dc3a010c7d01b50e0d17dc79c88080c0",
    );

    const tx = ox__TransactionEnvelopeEip2930.deserialize(
      serialized as ox__TransactionEnvelopeEip2930.Serialized,
    );
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      chainId: 1,
      to: checksumAddress(TEST_ACCOUNT_B.address),
      type: "eip2930",
    });
  });

  test("minimal (w/ accessList & gasPrice)", () => {
    const args = {
      accessList: [
        {
          address: "0x0000000000000000000000000000000000000000",
          storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
          ],
        },
      ],
      chainId: 1,
      gasPrice: fromGwei("2"),
    } as const;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0x01f8450180847735940080808080f838f7940000000000000000000000000000000000000000e1a00000000000000000000000000000000000000000000000000000000000000001",
    );
    expect(
      ox__TransactionEnvelopeEip2930.deserialize(
        serialized as ox__TransactionEnvelopeEip2930.Serialized,
      ).accessList,
    ).toEqual(args.accessList);
  });

  test("minimal (w/ type)", () => {
    const args = {
      chainId: 1,
      type: "eip2930",
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0x01c801808080808080c0");
    expect(
      ox__TransactionEnvelopeEip2930.deserialize(
        serialized as ox__TransactionEnvelopeEip2930.Serialized,
      ).type,
    ).toEqual("eip2930");
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
    expect(
      ox__TransactionEnvelopeEip2930.deserialize(
        serialized as ox__TransactionEnvelopeEip2930.Serialized,
      ).gas,
    ).toEqual(args.gas);
  });

  test("args: data", () => {
    const args = {
      ...BASE_EIP2930_TRANSACTION,
      data: "0x1234",
    } as const;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0x01f865018203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234f838f7941234512345123451234512345123451234512345e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
    );
    expect(
      ox__TransactionEnvelopeEip2930.deserialize(
        serialized as ox__TransactionEnvelopeEip2930.Serialized,
      ).data,
    ).toEqual(args.data);
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
    const tx = ox__TransactionEnvelopeEip2930.deserialize(
      serialized as ox__TransactionEnvelopeEip2930.Serialized,
    );
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_EIP2930_TRANSACTION,
      nonce: BigInt(BASE_EIP2930_TRANSACTION.nonce),
      r: ox__Hex.toBigInt(signature.r),
      s: ox__Hex.toBigInt(signature.s),
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

describe("eip7702", () => {
  const baseEip7702 = {
    ...BASE_TRANSACTION,
    authorizationList: [
      {
        address: wagmiTokenContractConfig.address.toLowerCase() as Address,
        chainId: 1,
        nonce: 420n,
        r: ox__Hex.toBigInt(
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ),
        s: ox__Hex.toBigInt(
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ),
        yParity: 0,
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        chainId: 10,
        nonce: 69n,
        r: ox__Hex.toBigInt(
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ),
        s: ox__Hex.toBigInt(
          "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
        ),
        yParity: 1,
      },
    ],
    chainId: 1,
  } as const;

  test("default", () => {
    const serialized = serializeTransaction({ transaction: baseEip7702 });
    assertType<ox__TransactionEnvelopeEip7702.Serialized>(
      serialized as `0x04${string}`,
    );
    expect(serialized).toMatchInlineSnapshot(
      `"0x04f8e3018203118080809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f8baf85c0194fba3912ca04dd458c843e2ee08967fc04f3579c28201a480a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fef85a0a9400000000000000000000000000000000000000004501a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    );
    const tx = ox__TransactionEnvelopeEip7702.deserialize(
      serialized as ox__TransactionEnvelopeEip7702.Serialized,
    );
    expect({
      ...tx,
      to: tx.to ? checksumAddress(tx.to) : undefined,
    }).toEqual({
      ...baseEip7702,
      nonce: BigInt(baseEip7702.nonce),
      type: "eip7702",
    });
  });

  test("signature", () => {
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip7702,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 1,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x04f90126018203118080809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f8baf85c0194fba3912ca04dd458c843e2ee08967fc04f3579c28201a480a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fef85a0a9400000000000000000000000000000000000000004501a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip7702,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          yParity: 0,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x04f90126018203118080809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f8baf85c0194fba3912ca04dd458c843e2ee08967fc04f3579c28201a480a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fef85a0a9400000000000000000000000000000000000000004501a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip7702,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 0n,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x04f90126018203118080809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f8baf85c0194fba3912ca04dd458c843e2ee08967fc04f3579c28201a480a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fef85a0a9400000000000000000000000000000000000000004501a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    );
    expect(
      serializeTransaction({
        transaction: {
          ...baseEip7702,
          r: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          s: "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
          v: 1n,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x04f90126018203118080809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f8baf85c0194fba3912ca04dd458c843e2ee08967fc04f3579c28201a480a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fef85a0a9400000000000000000000000000000000000000004501a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    );
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

    expect(serialized).toEqual(
      "0xe88203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080",
    );
    const tx = ox__TransactionEnvelopeLegacy.deserialize(
      serialized as ox__TransactionEnvelopeLegacy.Serialized,
    );
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_LEGACY_TRANSACTION,
      nonce: BigInt(BASE_LEGACY_TRANSACTION.nonce),
      type: "legacy",
    });
  });

  test("default (all zeros)", () => {
    const baseLegacyZero = {
      gasPrice: 0n,
      nonce: 0,
      to: checksumAddress(TEST_ACCOUNT_B.address),
      value: 0n,
    };

    const serialized = serializeTransaction({
      transaction: baseLegacyZero,
    });

    expect(serialized).toEqual(
      "0xda8080809470997970c51812dc3a010c7d01b50e0d17dc79c88080",
    );

    const tx = ox__TransactionEnvelopeLegacy.deserialize(
      serialized as ox__TransactionEnvelopeLegacy.Serialized,
    );
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      to: checksumAddress(TEST_ACCOUNT_B.address),
      type: "legacy",
    });
  });

  test("minimal (w/ gasPrice)", () => {
    const args = {
      gasPrice: fromGwei("2"),
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0xca80847735940080808080");
    expect(
      ox__TransactionEnvelopeLegacy.deserialize(serialized).gasPrice,
    ).toEqual(args.gasPrice);
  });

  test("minimal (w/ type)", () => {
    const args = {
      type: "legacy",
    };
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual("0xc6808080808080");
    expect(ox__TransactionEnvelopeLegacy.deserialize(serialized).type).toEqual(
      args.type,
    );
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
    expect(ox__TransactionEnvelopeLegacy.deserialize(serialized).gas).toEqual(
      args.gas,
    );
  });

  test("args: data", () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      data: "0x1234",
    } as const;
    const serialized = serializeTransaction({
      transaction: args,
    });
    expect(serialized).toEqual(
      "0xea8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234",
    );
    expect(ox__TransactionEnvelopeLegacy.deserialize(serialized).data).toEqual(
      args.data,
    );
  });

  test("args: chainId", () => {
    const args = {
      ...BASE_LEGACY_TRANSACTION,
      chainId: 69,
    } as const;
    const serialized = serializeTransaction({ transaction: args });
    expect(serialized).toEqual(
      "0xeb8203118477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080458080",
    );
    expect(
      ox__TransactionEnvelopeLegacy.deserialize(serialized).chainId,
    ).toEqual(args.chainId);
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
    const tx = ox__TransactionEnvelopeLegacy.deserialize(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...BASE_LEGACY_TRANSACTION,
      nonce: BigInt(BASE_LEGACY_TRANSACTION.nonce),
      r: ox__Hex.toBigInt(signature.r),
      s: ox__Hex.toBigInt(signature.s),
      type: "legacy",
      v: 28,
      yParity: 1,
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
    const tx = ox__TransactionEnvelopeLegacy.deserialize(serialized);
    expect({ ...tx, to: tx.to ? checksumAddress(tx.to) : undefined }).toEqual({
      ...args,
      nonce: BigInt(args.nonce),
      r: ox__Hex.toBigInt(signature.r),
      s: ox__Hex.toBigInt(signature.s),
      type: "legacy",
      v: 173,
      yParity: 0,
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
