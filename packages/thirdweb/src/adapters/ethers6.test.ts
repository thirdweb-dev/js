import { describe, test, expect } from "vitest";
import * as ethers6 from "ethers6";
import { privateKeyAccount } from "../wallets/private-key.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { toEthersSigner } from "./ethers6.js";
import type { Wallet } from "../wallets/interfaces/wallet.js";
import { defineChain } from "../chains/utils.js";

const FAKE_PKEY =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const account = privateKeyAccount({
  privateKey: FAKE_PKEY,
  client: TEST_CLIENT,
});

const FAKE_WALLET = {
  getAccount: () => account,
  getChain: () => defineChain(31337),
} as Wallet;

describe("toEthersSigner", () => {
  test("should return an ethers 6 signer", async () => {
    const signer = await toEthersSigner(ethers6, TEST_CLIENT, FAKE_WALLET);
    expect(signer).toBeDefined();
    expect(signer.signMessage).toBeDefined();
  });

  test("should sign typed data", async () => {
    const signer = await toEthersSigner(ethers6, TEST_CLIENT, FAKE_WALLET);
    expect(signer.signTypedData).toBeDefined();

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

    const signature = await signer.signTypedData(domain, types, value);

    expect(signature).toMatchInlineSnapshot(
      `"0x10d3ce8040590e48889801080ad40f3d514c2c3ce03bbbe3e179bbf5ba56c75425951fa15220f637e2ab79fd033b99c4b340339e00e360316547e956c61ffcb01c"`,
    );
  });
});
