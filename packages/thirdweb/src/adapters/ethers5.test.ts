import * as ethers5 from "ethers5";
import { describe, expect, test } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { toEthersSigner } from "./ethers5.js";

const account = privateKeyToAccount({
  privateKey: ANVIL_PKEY_A,
  client: TEST_CLIENT,
});

describe("ethers5 adapter", () => {
  test("should return an ethers 5 signer", async () => {
    const signer = await toEthersSigner(
      ethers5,
      TEST_CLIENT,
      account,
      ANVIL_CHAIN,
    );
    expect(signer).toBeDefined();
    expect(signer.signMessage).toBeDefined();
  });

  test("should sign message", async () => {
    const signer = await toEthersSigner(
      ethers5,
      TEST_CLIENT,
      account,
      ANVIL_CHAIN,
    );
    const expectedSig = await account.signMessage({ message: "hello world" });
    const sig = await signer.signMessage("hello world");
    expect(sig).toBe(expectedSig);
  });

  test("should sign typed data", async () => {
    const signer = await toEthersSigner(
      ethers5,
      TEST_CLIENT,
      account,
      ANVIL_CHAIN,
    );
    expect(signer._signTypedData).toBeDefined();

    // All properties on a domain are optional
    const domain = {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    };

    // The data to sign
    const value = {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    };

    const signature = await signer._signTypedData(domain, types, value);

    expect(signature.length).toBe(132);
  });

  test("should send a tx", async () => {
    const signer = await toEthersSigner(
      ethers5,
      TEST_CLIENT,
      account,
      ANVIL_CHAIN,
    );
    const txResponse = await signer.sendTransaction({
      to: TEST_ACCOUNT_B.address,
      value: 100,
    });
    expect(txResponse.hash.length).toBe(66);
  });
});
