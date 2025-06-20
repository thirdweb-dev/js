import * as ox__Bytes from "ox/Bytes";
import { beforeAll, describe, expect, it, test } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { ethereum, mainnet } from "../chains/chain-definitions/ethereum.js";
import { sepolia } from "../chains/chain-definitions/sepolia.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { smartWallet } from "../wallets/smart/smart-wallet.js";
import {
  verifyContractWalletSignature,
  verifyEOASignature,
  verifySignature,
} from "./verify-signature.js";

describe("verifyEOASignature", () => {
  test("should return true for a valid signature", async () => {
    const message = "Hello world!";

    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: TEST_ACCOUNT_A.address,
      message,
      signature,
    });
    expect(result).toBe(true);
  });

  test("should return false for an invalid signature", async () => {
    const options = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      message: "Hello, world!",
      signature: "invalid",
    };

    const result = await verifyEOASignature(options);
    expect(result).toBe(false);
  });

  test("should return false for a different address", async () => {
    const message = "Hello, world!";
    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      message,
      signature,
    });
    expect(result).toBe(false);
  });

  test("should return false for a different message", async () => {
    const message = "Hello, world!";
    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: TEST_ACCOUNT_A.address,
      message: "Hello, world",
      signature,
    });
    expect(result).toBe(false);
  });
});

describe.runIf(process.env.TW_SECRET_KEY)(
  "verifyContractWalletSignature",
  () => {
    it("should verify a valid signature", async () => {
      expect(
        await verifySignature({
          address: "0x087517aA5153361d5b51B3a062D895443A28458b",
          chain: sepolia,
          client: TEST_CLIENT,
          message: "Hakuna matata",
          signature:
            "0xbc667c1a98b1e5a347944dc6c62d2f8b9669aa05927b8dc39f500ce94fa75ce967a4903869d85eaeea40aaf29642c5152da56bad3bbe5026fb6b9249e234fa7d1b",
        }),
      ).toBe(true);
    });

    test("should fail with an invalid signature", async () => {
      expect(
        await verifySignature({
          address: "0x087517aA5153361d5b51B3a062D895443A28458b",
          chain: FORKED_ETHEREUM_CHAIN,
          client: TEST_CLIENT,
          message: "Hakuna matata",
          signature: "0xthirdweb",
        }),
      ).toBe(false);
    });

    test("coinbase smart wallet verification", async () => {
      expect(
        await verifySignature({
          address: "0x0b1e353DDcec71a94AC76ad6b7e75618E3A9CA81",
          chain: mainnet,
          client: TEST_CLIENT,
          message: "Hakuna matata",
          signature:
            "0x0000000000000000000000000ba5ed0c6aa8c49038f819e587e2633c4a9f428a0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000e43ffba36f000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000406e033e8bd44ba8d7fe309535da2dcf38bbf6aa0144937adf2b4851e506a8afe10e8d53896201a64512e72414c2aa3b626b18b2a9931d5dd09d57e147662af7530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001dadf7562d6e80ba80295ba01e7a749623df8e204ca7109bcda8fbfee67497a1f084be7126e8f59a3b4ffd09dd14804b203bc29c82d6f0e987396f3b825b2549c0000000000000000000000000000000000000000000000000000000000000025f198086b2db17256731bc456673b96bcef23f51d1fbacdd7c4379ef65465572f1900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a226c66723934623767656d7249515936623061523253456d417445356a337162716d335a454765625f563338222c226f726967696e223a2268747470733a2f2f6b6579732e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d000000000000000000000000000000000000000000006492649264926492649264926492649264926492649264926492649264926492", // The CBSW factory was deployed more recently than our fork, it's only an eth_call so live mainnet is okay
        }),
      ).toBe(true);
    });
  },
);

describe.runIf(process.env.TW_SECRET_KEY)(
  "verifyContractWalletSignature",
  () => {
    const message = "Hakuna matata";
    const wallet = smartWallet({
      chain: ethereum,
      gasless: true,
    });
    let smartAccount: Account;

    beforeAll(async () => {
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount: TEST_ACCOUNT_A,
      });
    });

    test("should verify a smart account signature", async () => {
      const rawSignature = await smartAccount.signMessage({ message });
      const result = await verifyContractWalletSignature({
        address: smartAccount.address,
        chain: ethereum,
        client: TEST_CLIENT,
        message,
        signature: rawSignature,
      });
      expect(result).toBe(true);
    });

    test("should verify a smart account signature as bytes", async () => {
      const rawSignature = await smartAccount.signMessage({ message });
      const bytesSignature = ox__Bytes.fromHex(rawSignature);
      const result = await verifyContractWalletSignature({
        address: smartAccount.address,
        chain: ethereum,
        client: TEST_CLIENT,
        message,
        signature: bytesSignature,
      });
      expect(result).toBe(true);
    });
  },
);
