import { expect, test } from "vitest";

import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { signMessage } from "./sign-message.js";

test("default", async () => {
  expect(
    signMessage({
      message: "hello world",
      privateKey: ANVIL_PKEY_A,
    }),
  ).toMatchInlineSnapshot(
    '"0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b"',
  );

  expect(
    signMessage({
      message: "🤯",
      privateKey: ANVIL_PKEY_A,
    }),
  ).toMatchInlineSnapshot(
    '"0xc0cd7599731c37aa4c0815a89dc8dcb4ce479f83df7ee8ffc606a9ef29323e814b54bb8935b56e7c690f1ee4c6290da5c2f6df6fc3443fbe96bb1846a2c4fefc1c"',
  );
});

test("raw", async () => {
  expect(
    signMessage({
      message: { raw: "0x68656c6c6f20776f726c64" },
      privateKey: ANVIL_PKEY_A,
    }),
  ).toMatchInlineSnapshot(
    '"0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b"',
  );

  expect(
    signMessage({
      message: {
        raw: Uint8Array.from([
          104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
        ]),
      },
      privateKey: ANVIL_PKEY_A,
    }),
  ).toMatchInlineSnapshot(
    '"0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b"',
  );
});
