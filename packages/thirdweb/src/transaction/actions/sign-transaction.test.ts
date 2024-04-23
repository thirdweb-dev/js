import {
  type TransactionSerializable,
  type TransactionSerializableBase,
  type TransactionSerializableEIP1559,
  type TransactionSerializableEIP2930,
  type TransactionSerializableLegacy,
  zeroAddress,
} from "viem";
import { describe, expect, test } from "vitest";
import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { fromGwei } from "../../utils/units.js";
import { signTransaction } from "./sign-transaction.js";

const BASE_TRANSACTION = {
  gas: 21000n,
  nonce: 785,
} satisfies TransactionSerializableBase;

describe("eip1559", () => {
  const BASE_EIP1559_TRANSACTION = {
    ...BASE_TRANSACTION,
    chainId: 1,
    type: "eip1559",
  } as const satisfies TransactionSerializableEIP1559;

  test("default", () => {
    const signature = signTransaction({
      transaction: BASE_EIP1559_TRANSACTION,
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33"',
    );
  });

  test("with maxFeePerGas", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP1559_TRANSACTION,
        maxFeePerGas: 1n,
      },
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x02f850018203118001825208808080c080a02b89e41bbb3da8aa2edbc47596f9669c472a1f604795247ea074a5dd7f46c97aa04070caf004ae82551a3d55caceacc50ae309883298c84105505b0cc31b3ec6d6"',
    );
  });

  test("with maxPriorityFeePerGas", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP1559_TRANSACTION,
        maxFeePerGas: fromGwei("20"),
        maxPriorityFeePerGas: fromGwei("2"),
      },
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x02f8590182031184773594008504a817c800825208808080c001a06ea33b188b30a5f5d0d1cec62b2bac7203ff428a49048766596727737689043fa0255b74c8e704e3692497a29cd246ffc4344b4107457ce1c914fe2b4e09993859"',
    );
  });

  test("with accessList", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP1559_TRANSACTION,
        accessList: [
          {
            address: zeroAddress,
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe",
            ],
          },
        ],
      },
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x02f8ac018203118080825208808080f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a0ab47ceec8673fd579fe961f3ee8f31e6e06985fccdde9ad61d03d304bd37d71da0670b6469de6010c8685e4c849a0eb4d5f8f782cab989296101c81c3e81fd3c0d"',
    );
  });

  test("with data", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP1559_TRANSACTION,
        data: "0x1234",
      },
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x02f8520182031180808252088080821234c001a054d552c58a162c9003633c20871d8e381ef7a3c35d1c8a79c7c12d5cf09a0914a03c5d6241f8c4fcf8b35262de038d3ab1940feb1a70b934ae5d40ea6bce912e2d"',
    );
  });
});

describe("eip2930", () => {
  const BASE_EIP2930_TRANSACTION = {
    ...BASE_TRANSACTION,
    chainId: 1,
    type: "eip2930",
  } as const satisfies TransactionSerializable;

  test("default", () => {
    const signature = signTransaction({
      transaction: BASE_EIP2930_TRANSACTION,
      privateKey: ANVIL_PKEY_A,
    });
    expect(signature).toMatchInlineSnapshot(
      '"0x01f84f0182031180825208808080c080a089cebce5c7f728febd1060b55837c894ec2a79dd7854350abce252fc2de96b5da039f2782c70b92f4b1916aa8db91453c7229f33458bd091b3e10a40f9a7e443d2"',
    );
  });

  test("with accessList and gasPrice", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP2930_TRANSACTION,
        gasPrice: fromGwei("2"),
        accessList: [
          {
            address: zeroAddress,
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
        ],
      } as TransactionSerializableEIP2930,
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x01f88c018203118477359400825208808080f838f7940000000000000000000000000000000000000000e1a0000000000000000000000000000000000000000000000000000000000000000001a0da12dbd793012df6fcf099460ebcc4d5f6bccdc86218b35389b387d479c27129a045f1ccd6edad0727b47a1985469a3a101c31378395bc0b045d55357e7a19baf0"',
    );
  });

  test("with data", () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_EIP2930_TRANSACTION,
        data: "0x1234",
      },
      privateKey: ANVIL_PKEY_A,
    });

    expect(signature).toMatchInlineSnapshot(
      '"0x01f85101820311808252088080821234c080a084fdcea5fe55ce8378aa94a8d4a9c01545d59922f1edcdd89a71ebf740dc0bf5a0539a4ab61a42509a6b4c35c85099d8b7b8e815967f0c832c868327caca6307cb"',
    );
  });
});

describe("legacy", () => {
  const BASE_LEGACY_TRANSACTION = {
    ...BASE_TRANSACTION,
    gasPrice: fromGwei("2"),
    type: "legacy",
  } as const satisfies TransactionSerializableLegacy;

  test("default", () => {
    const signature = signTransaction({
      transaction: BASE_LEGACY_TRANSACTION,
      privateKey: ANVIL_PKEY_A,
    });
    expect(signature).toMatchInlineSnapshot(
      '"0xf85182031184773594008252088080801ba0462e5dabe6d0e82ac9d2832d5ecc815e317669ae2eb018c2a07ae6f3a4763618a003214adcddee51ee1d46cb12a694f5520c851581fe53c543c8999d45fa18de07"',
    );
  });

  test("with gasPrice", () => {
    expect(
      signTransaction({
        transaction: {
          gasPrice: fromGwei("2"),
        },
        privateKey: ANVIL_PKEY_A,
      }),
    ).toMatchInlineSnapshot(
      '"0xf84d808477359400808080801ba07abf45a28c3ce5a1d79d5ab5362878be5411ac51b3c2316670e1263936ef869ea001ca38d1782880bff3e2056f4949e75418858195b06fa8b6b13910a789e51989"',
    );
  });
});
