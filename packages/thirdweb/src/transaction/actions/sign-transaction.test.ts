import type { TransactionSerializableBase } from "viem";
import { describe, expect, test } from "vitest";
import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { signTransaction } from "./sign-transaction.js";

const BASE_TRANSACTION = {
  gas: 21000n,
  nonce: 785,
} satisfies TransactionSerializableBase;

describe("signTransaction", () => {
  test("default w/ legacy gasPrice", async () => {
    const signature = signTransaction({
      transaction: {
        ...BASE_TRANSACTION,
        gasPrice: 1n, // default legacy transaction
      },
      privateKey: ANVIL_PKEY_A,
    });
    expect(signature).toMatchInlineSnapshot(
      '"0xf84d820311018252088080801ca0c8624e076e109748268ff37c3c7291f34b1eb8c576ea3558bbb689bc5390d1bba01d1c58180f52deac8dce8b3edaedd1dc72323131be27800f219a7ca045a00fd6"',
    );
  });

  test("minimal w/ maxFeePerGas", async () => {
    expect(
      signTransaction({
        transaction: {
          chainId: 1,
          maxFeePerGas: 1n,
        },
        privateKey: ANVIL_PKEY_A,
      }),
    ).toMatchInlineSnapshot(
      '"0x02f84c0180800180808080c080a0c95f157628e67a435b1b85584db1b8346cbccf9890d28466f6edfed07d097793a03bdfde4f59a340a4308b5b4d2c89da83838d691c8059b228d0667309f1d2e893"',
    );
  });

  // TODO: Add eip1559 test suite
  // TODO: Add eip2930 test suite
  // TODO: Add eip4844 test suite
  // TODO: Add legacy transaction test suite
});
