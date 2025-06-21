import * as ethers5 from "ethers5";
import * as ethers6 from "ethers6";
import { describe, expect, it, test } from "vitest";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { ANVIL_CHAIN, FORKED_ETHEREUM_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import { decimals } from "../extensions/erc20/__generated__/IERC20/read/decimals.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { randomBytesBuffer } from "../utils/random.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import {
  fromEthersContract,
  fromEthersSigner,
  toEthersContract,
  toEthersProvider,
  toEthersSigner,
} from "./ethers5.js";

const account = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_A,
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

  test("should sign raw message", async () => {
    const signer = await toEthersSigner(
      ethers5,
      TEST_CLIENT,
      account,
      ANVIL_CHAIN,
    );
    const bytes = randomBytesBuffer(32);
    const expectedSig = await account.signMessage({ message: { raw: bytes } });
    const sig = await signer.signMessage(bytes);
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

  it("toEthersContract should work", async () => {
    const ethersContract = await toEthersContract(ethers5, USDT_CONTRACT);
    expect(ethersContract.address.toLowerCase()).toBe(
      USDT_CONTRACT.address.toLowerCase(),
    );
    const decimals = await ethersContract.decimals();
    expect(decimals.toString()).toBe("6");
  });

  it("fromEthersContract should work", async () => {
    const provider = toEthersProvider(
      ethers5,
      TEST_CLIENT,
      FORKED_ETHEREUM_CHAIN,
    );
    const ethersContract = new ethers5.Contract(
      USDT_CONTRACT.address,
      await resolveContractAbi(USDT_CONTRACT),
      provider,
    );

    const thirdwebContract = await fromEthersContract({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      ethersContract,
    });

    const _decimals = await decimals({ contract: thirdwebContract });
    expect(_decimals).toBe(6);
  });

  test("toEthersProvider should return a valid provider", async () => {
    const provider = toEthersProvider(ethers5, TEST_CLIENT, ANVIL_CHAIN);
    expect(provider).toBeDefined();
    expect(provider.getBlockNumber).toBeDefined();

    // Test if the provider can fetch the block number
    const blockNumber = await provider.getBlockNumber();
    expect(typeof blockNumber).toBe("number");
  });

  test("toEthersProvider should throw error with invalid ethers version", () => {
    const invalidEthers = ethers6;
    expect(() =>
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid data
      toEthersProvider(invalidEthers as any, TEST_CLIENT, ANVIL_CHAIN),
    ).toThrow(
      "You seem to be using ethers@6, please use the `ethers6Adapter()`",
    );
  });
});

describe("fromEthersSigner", () => {
  it("should convert an ethers5 Signer to an Account", async () => {
    const wallet = new ethers5.Wallet(ANVIL_PKEY_A);
    const account = await fromEthersSigner(wallet);

    expect(account).toBeDefined();
    expect(account.address).toBe(await wallet.getAddress());
  });

  it("should sign a message", async () => {
    const wallet = new ethers5.Wallet(ANVIL_PKEY_A);
    const account = await fromEthersSigner(wallet);

    const message = "Hello, world!";
    const signature = await account.signMessage({ message });

    expect(signature).toBe(await wallet.signMessage(message));
  });

  it("should sign a transaction", async () => {
    const wallet = new ethers5.Wallet(
      ANVIL_PKEY_A,
      ethers5.getDefaultProvider(),
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
    const wallet = new ethers5.Wallet(
      ANVIL_PKEY_A,
      ethers5.getDefaultProvider(ANVIL_CHAIN.rpc),
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
    const wallet = new ethers5.Wallet(ANVIL_PKEY_A);
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
