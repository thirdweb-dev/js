import { parseSignature } from "viem";
import { describe, expect, test } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { toBytes } from "../utils/encoding/to-bytes.js";
import { hashMessage } from "../utils/hashing/hashMessage.js";
import { signMessage } from "../utils/signatures/sign-message.js";
import { verifyHash } from "./verify-hash.js";

describe("verifyHash", async () => {
  describe("EOA", async () => {
    test("hex", async () => {
      const signature = signMessage({
        message: "hello world",
        privateKey: ANVIL_PKEY_A,
      });

      await expect(
        verifyHash({
          address: TEST_ACCOUNT_A.address,
          chain: FORKED_ETHEREUM_CHAIN,
          client: TEST_CLIENT,
          hash: hashMessage("hello world"),
          signature,
        }),
      ).resolves.toBe(true);
    });

    test("bytes", async () => {
      const signature = signMessage({
        message: "hello world",
        privateKey: ANVIL_PKEY_A,
      });

      await expect(
        verifyHash({
          address: TEST_ACCOUNT_A.address,
          chain: FORKED_ETHEREUM_CHAIN,
          client: TEST_CLIENT,
          hash: hashMessage("hello world"),
          signature: toBytes(signature),
        }),
      ).resolves.toBe(true);
    });

    test("object", async () => {
      const signature = signMessage({
        message: "hello world",
        privateKey: ANVIL_PKEY_A,
      });

      await expect(
        verifyHash({
          address: TEST_ACCOUNT_A.address,
          chain: FORKED_ETHEREUM_CHAIN,
          client: TEST_CLIENT,
          hash: hashMessage("hello world"),
          signature: parseSignature(signature),
        }),
      ).resolves.toBe(true);
    });
  });
});

// TODO: Create utilities to mock smart accounts on anvil so we can test them here
