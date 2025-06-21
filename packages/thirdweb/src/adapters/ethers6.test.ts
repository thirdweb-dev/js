import * as ethers6 from "ethers6";
import { describe, expect, it, test } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { randomBytesBuffer } from "../utils/random.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { fromEthersSigner, toEthersSigner } from "./ethers6.js";

const account = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_A,
});

describe("toEthersSigner", () => {
  test("should return an ethers 6 signer", async () => {
    const signer = toEthersSigner(ethers6, TEST_CLIENT, account, ANVIL_CHAIN);
    expect(signer).toBeDefined();
    expect(signer.signMessage).toBeDefined();
  });

  test("should sign message", async () => {
    const signer = toEthersSigner(ethers6, TEST_CLIENT, account, ANVIL_CHAIN);
    const expectedSig = await account.signMessage({ message: "hello world" });
    const sig = await signer.signMessage("hello world");
    expect(sig).toBe(expectedSig);
  });

  test("should sign raw message", async () => {
    const signer = toEthersSigner(ethers6, TEST_CLIENT, account, ANVIL_CHAIN);
    const bytes = randomBytesBuffer(32);
    const expectedSig = await account.signMessage({ message: { raw: bytes } });
    const sig = await signer.signMessage(bytes);
    expect(sig).toBe(expectedSig);
  });

  test("should sign typed data", async () => {
    const signer = toEthersSigner(ethers6, TEST_CLIENT, account, ANVIL_CHAIN);
    expect(signer.signTypedData).toBeDefined();

    // All properties on a domain are optional
    const domain = {
      chainId: 1,
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    };

    // The named list of all type definitions
    const types = {
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
    };

    // The data to sign
    const value = {
      contents: "Hello, Bob!",
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
    };

    const signature = await signer.signTypedData(domain, types, value);

    expect(signature.length).toBe(132);
  });

  test("should send a tx", async () => {
    const signer = toEthersSigner(ethers6, TEST_CLIENT, account, ANVIL_CHAIN);
    const txResponse = await signer.sendTransaction({
      to: TEST_ACCOUNT_B.address,
      value: 100,
    });
    expect(txResponse.hash.length).toBe(66);
  });
});

describe("fromEthersSigner", () => {
  it("should convert an ethers6 Signer to an Account", async () => {
    const wallet = new ethers6.Wallet(ANVIL_PKEY_A);
    const account = await fromEthersSigner(wallet);

    expect(account).toBeDefined();
    expect(account.address).toBe(await wallet.getAddress());
  });

  it("should sign a message", async () => {
    const wallet = new ethers6.Wallet(ANVIL_PKEY_A);
    const account = await fromEthersSigner(wallet);

    const message = "Hello, world!";
    const signature = await account.signMessage({ message });

    expect(signature).toBe(await wallet.signMessage(message));
  });

  it("should sign a transaction", async () => {
    const wallet = new ethers6.Wallet(
      ANVIL_PKEY_A,
      ethers6.getDefaultProvider(),
    );
    const account = await fromEthersSigner(wallet);

    const transaction = {
      to: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      value: 1n,
    };

    const signedTransaction = await account.signTransaction?.(transaction);

    expect(signedTransaction).toBe(await wallet.signTransaction(transaction));
  });

  it("should send a transaction", async () => {
    const wallet = new ethers6.Wallet(
      ANVIL_PKEY_A,
      ethers6.getDefaultProvider(ANVIL_CHAIN.rpc),
    );
    const account = await fromEthersSigner(wallet);

    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      to: TEST_ACCOUNT_B.address,
      value: 1n,
    });

    const txResponse = await sendTransaction({ account, transaction });

    expect(txResponse.transactionHash.length).toBe(66);
  });

  it("should sign typed data", async () => {
    const wallet = new ethers6.Wallet(ANVIL_PKEY_A);
    const account = await fromEthersSigner(wallet);

    const domain = {
      chainId: 1,
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    };

    const types = {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
    };

    const value = {
      name: "Alice",
      wallet: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    };

    const signature = await account.signTypedData({
      domain,
      message: value,
      primaryType: "Person",
      types,
    });

    expect(signature).toBeDefined();
  });
});
