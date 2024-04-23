import { maxUint256 } from "viem";
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
import { deployERC1155Contract } from "../../prebuilts/deploy-erc1155.js";
import { getNFT } from "../read/getNFT.js";
import { generateMintSignature, mintWithSignature } from "./sigMint.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("generateMintSignature1155", () => {
  let erc1155Contract: ThirdwebContract;
  let erc20TokenContract: ThirdwebContract;

  beforeAll(async () => {
    erc1155Contract = getContract({
      address: await deployERC1155Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC1155",
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
        quantity: 10n,
        pricePerToken: "0.1",
        metadata: {
          name: "My NFT",
          description: "This is my NFT",
          image: "https://example.com/image.png",
        },
      },
      account: TEST_ACCOUNT_A,
      contract: erc1155Contract,
    });
    const transaction = mintWithSignature({
      contract: erc1155Contract,
      payload,
      signature,
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(transactionHash.length).toBe(66);
    const nft = await getNFT({
      contract: erc1155Contract,
      tokenId: 0n,
    });
    if (nft.type !== "ERC1155") throw new Error("Expected ERC1155 NFT");
    expect(nft.id).toBe(0n);
    expect(nft.supply).toBe(10n);
    expect(nft.metadata.name).toBe("My NFT");
    expect(nft.metadata.description).toBe("This is my NFT");
  });

  it("should mint additional supply", async () => {
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: 5n,
        tokenId: 0n,
      },
      account: TEST_ACCOUNT_A,
      contract: erc1155Contract,
    });
    const transaction = mintWithSignature({
      contract: erc1155Contract,
      payload,
      signature,
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    expect(transactionHash.length).toBe(66);
    const nft = await getNFT({
      contract: erc1155Contract,
      tokenId: 0n,
    });
    if (nft.type !== "ERC1155") throw new Error("Expected ERC1155 NFT");
    expect(nft.id).toBe(0n);
    expect(nft.supply).toBe(15n);
    expect(nft.metadata.name).toBe("My NFT");
    expect(nft.metadata.description).toBe("This is my NFT");
  });

  it("should generate a mint signature with default values", async () => {
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: 10n,
        metadata: "https://example.com/token",
      },
      account: TEST_ACCOUNT_A,
      contract: erc1155Contract,
    });

    expect(payload.to).toBe(TEST_ACCOUNT_B.address);
    expect(payload.tokenId).toBe(maxUint256);
    expect(payload.royaltyRecipient).toBe(TEST_ACCOUNT_A.address);
    expect(payload.royaltyBps).toBe(0n);
    expect(payload.primarySaleRecipient).toBe(TEST_ACCOUNT_A.address);
    expect(payload.uri).toBe("https://example.com/token");
    expect(payload.pricePerToken).toBe(0n);
    expect(payload.quantity).toBe(10n);
    expect(payload.currency).toBe(NATIVE_TOKEN_ADDRESS);
    expect(payload.validityStartTimestamp).toBe(0n);
    expect(payload.validityEndTimestamp).toBeGreaterThan(0n);
    expect(payload.uid).toBeDefined();
    expect(signature.length).toBe(132);

    const transaction = mintWithSignature({
      contract: erc1155Contract,
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
    const uid = toHex("abcdef1234567890", { size: 32 });
    const { payload, signature } = await generateMintSignature({
      mintRequest: {
        to: TEST_ACCOUNT_B.address,
        quantity: 10n,
        royaltyRecipient: TEST_ACCOUNT_B.address,
        royaltyBps: 500,
        primarySaleRecipient: TEST_ACCOUNT_A.address,
        tokenId: 0n,
        pricePerToken: "0.2",
        currency: erc20TokenContract.address,
        validityStartTimestamp: new Date(1635724800),
        validityEndTimestamp: new Date(1867260800),
        uid,
      },
      account: TEST_ACCOUNT_A,
      contract: erc1155Contract,
    });

    expect(payload.to).toBe(TEST_ACCOUNT_B.address);
    expect(payload.tokenId).toBe(0n);
    expect(payload.royaltyRecipient).toBe(TEST_ACCOUNT_B.address);
    expect(payload.royaltyBps).toBe(500n);
    expect(payload.primarySaleRecipient).toBe(TEST_ACCOUNT_A.address);
    expect(payload.uri).toBe("");
    expect(payload.pricePerToken).toBe(200000000000000000n);
    expect(payload.quantity).toBe(10n);
    expect(payload.currency).toBe(erc20TokenContract.address);
    expect(payload.validityStartTimestamp).toBe(1635724n);
    expect(payload.validityEndTimestamp).toBe(1867260n);
    expect(payload.uid).toBe(uid);
    expect(signature.length).toBe(132);
  });
});
