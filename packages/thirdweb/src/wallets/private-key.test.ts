import { expect, test } from "vitest";
import { parseEther, parseGwei } from "viem/utils";

import { privateKeyAccount } from "./private-key.js";
import { ANVIL_PKEY_A } from "~test/test-wallets.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { typedData } from "~test/typed-data.js";

test("default", () => {
  expect(privateKeyAccount({ privateKey: ANVIL_PKEY_A, client: TEST_CLIENT }))
    .toMatchInlineSnapshot(`
    {
      "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
      "sendTransaction": [Function],
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "source": "privateKey",
      "type": "local",
    }
  `);
});

test("sign message", async () => {
  const account = privateKeyAccount({
    privateKey: ANVIL_PKEY_A,
    client: TEST_CLIENT,
  });
  expect(
    await account.signMessage({ message: "hello world" }),
  ).toMatchInlineSnapshot(
    '"0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b"',
  );
});

test("sign transaction", async () => {
  const account = privateKeyAccount({
    privateKey: ANVIL_PKEY_A,
    client: TEST_CLIENT,
  });
  expect(
    await account.signTransaction({
      chainId: 1,
      maxFeePerGas: parseGwei("20"),
      gas: 21000n,
      to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      value: parseEther("1"),
    }),
  ).toMatchInlineSnapshot(
    '"0x02f86f0180808504a817c8008252089470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c001a0f40a2d2ae9638056cafbe9083c7125edc8555e0e715db0984dd859a5c6dfac57a020f36fd0b32bef4d6d75c62f220e59c5fb60c244ca3b361e750985ee5c3a0931"',
  );
});

test("sign typed data", async () => {
  const account = privateKeyAccount({
    privateKey: ANVIL_PKEY_A,
    client: TEST_CLIENT,
  });
  expect(
    await account.signTypedData({ ...typedData.basic, primaryType: "Mail" }),
  ).toMatchInlineSnapshot(
    '"0x32f3d5975ba38d6c2fba9b95d5cbed1febaa68003d3d588d51f2de522ad54117760cfc249470a75232552e43991f53953a3d74edf6944553c6bef2469bb9e5921b"',
  );
});
