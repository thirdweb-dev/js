import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { toHex } from "../../../utils/encoding/hex.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { generateMintSignature, mintWithSignature } from "./sigMint.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("generateMintSignature20", () => {
  let erc20Contract: ThirdwebContract;
  let erc20TokenContract: ThirdwebContract;

  beforeAll(async () => {
    erc20Contract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC20",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    erc20TokenContract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "TestToken",
          symbol: "TSTT",
        },
        type: "TokenERC20",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 60000);

  it("should generate a mint signature and mint an NFT", async () => {
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: "0.1",
      },
      account: TEST_ACCOUNT_A,
      contract: erc20Contract,
    });
    const transaction = mintWithSignature({
      contract: erc20Contract,
      payload,
      signature,
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(transactionHash.length).toBe(66);
  });

  it("should generate a mint signature with default values", async () => {
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: "0.1",
      },
      account: TEST_ACCOUNT_A,
      contract: erc20Contract,
    });

    expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    expect(payload.primarySaleRecipient).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    );
    expect(payload.quantity).toBe(100000000000000000n);
    expect(payload.price).toBe(0n);
    expect(payload.currency).toBe(NATIVE_TOKEN_ADDRESS);
    expect(payload.validityStartTimestamp).toBe(0n);
    expect(payload.validityEndTimestamp).toBeGreaterThan(0n);
    expect(payload.uid).toBeDefined();
    expect(signature.length).toBe(132);

    const transaction = mintWithSignature({
      contract: erc20Contract,
      payload,
      signature,
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(transactionHash.length).toBe(66);
  });

  it("should generate a mint signature with custom values", async () => {
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: "0.005",
        primarySaleRecipient: TEST_ACCOUNT_A.address,
        price: "0.2",
        currency: erc20TokenContract.address,
        validityStartTimestamp: new Date(1635724800),
        validityEndTimestamp: new Date(1867260800),
        uid: toHex("abcdef1234567890", { size: 32 }),
      },
      account: TEST_ACCOUNT_A,
      contract: erc20Contract,
    });

    expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    expect(payload.primarySaleRecipient).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    );
    expect(payload.quantity).toBe(5000000000000000n);
    expect(payload.price).toBe(200000000000000000n);
    expect(payload.currency).toBe(erc20TokenContract.address);
    expect(payload.validityStartTimestamp).toBe(1635724n);
    expect(payload.validityEndTimestamp).toBe(1867260n);
    expect(payload.uid).toBe(
      "0x6162636465663132333435363738393000000000000000000000000000000000",
    );
    expect(signature.length).toBe(132);
  });
});
