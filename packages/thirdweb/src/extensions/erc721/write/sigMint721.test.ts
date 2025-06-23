import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import { toHex } from "../../../utils/encoding/hex.js";
import { deployERC20Contract } from "../../prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { generateMintSignature, mintWithSignature } from "./sigMint.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)(
  "generateMintSignature721",

  () => {
    let erc721Contract: ThirdwebContract;
    let erc20TokenContract: ThirdwebContract;

    beforeAll(async () => {
      erc721Contract = getContract({
        address: await deployERC721Contract({
          account: TEST_ACCOUNT_A,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          params: {
            name: "Test",
            royaltyRecipient: TEST_ACCOUNT_C.address,
            saleRecipient: TEST_ACCOUNT_B.address,
            symbol: "TST",
          },
          type: "TokenERC721",
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

    it("should generate a mint signature and mint an NFT for LoyaltyContract", async () => {
      const loyaltyContract = getContract({
        address: await deployERC721Contract({
          account: TEST_ACCOUNT_A,
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          params: {
            name: "Test",
            royaltyRecipient: TEST_ACCOUNT_C.address,
            saleRecipient: TEST_ACCOUNT_B.address,
            symbol: "TST",
          },
          type: "LoyaltyCard",
        }),
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: loyaltyContract,
        contractType: "LoyaltyCard",
        mintRequest: {
          metadata: {
            description: "This is my NFT",
            image: "https://example.com/image.png",
            name: "My NFT",
          },
          to: TEST_ACCOUNT_B.address,
        },
      });
      const transaction = mintWithSignature({
        contract: loyaltyContract,
        payload,
        signature,
      });
      const { transactionHash } = await sendTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
      });
      expect(transactionHash.length).toBe(66);
    });

    it("should generate a mint signature and mint an NFT", async () => {
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
        mintRequest: {
          metadata: {
            description: "This is my NFT",
            image: "https://example.com/image.png",
            name: "My NFT",
          },
          to: TEST_ACCOUNT_B.address,
        },
      });
      const transaction = mintWithSignature({
        contract: erc721Contract,
        payload,
        signature,
      });
      const { transactionHash } = await sendTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
      });
      expect(transactionHash.length).toBe(66);
    });

    it("should generate a mint signature with default values", async () => {
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
        mintRequest: {
          metadata: "https://example.com/token",
          to: TEST_ACCOUNT_B.address,
        },
      });

      expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(payload.royaltyRecipient).toBe(TEST_ACCOUNT_C.address);
      expect(payload.royaltyBps).toBe(0n);
      expect(payload.primarySaleRecipient).toBe(TEST_ACCOUNT_B.address);
      expect(payload.uri).toBe("https://example.com/token");
      expect(payload.price).toBe(0n);
      expect(payload.currency).toBe(NATIVE_TOKEN_ADDRESS);
      expect(payload.validityStartTimestamp).toBe(0n);
      expect(payload.validityEndTimestamp).toBeGreaterThan(0n);
      expect(payload.uid).toBeDefined();
      expect(signature.length).toBe(132);

      const transaction = mintWithSignature({
        contract: erc721Contract,
        payload,
        signature,
      });
      const { transactionHash } = await sendTransaction({
        account: TEST_ACCOUNT_A,
        transaction,
      });
      expect(transactionHash.length).toBe(66);
    });

    it("should generate a mint signature with custom values", async () => {
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
        mintRequest: {
          currency: erc20TokenContract.address,
          metadata: "https://example.com/token",
          price: "0.2",
          primarySaleRecipient: TEST_ACCOUNT_A.address,
          royaltyBps: 500,
          royaltyRecipient: TEST_ACCOUNT_B.address,
          to: TEST_ACCOUNT_B.address,
          uid: toHex("abcdef1234567890", { size: 32 }),
          validityEndTimestamp: new Date(1867260800),
          validityStartTimestamp: new Date(1635724800),
        },
      });

      expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(payload.royaltyRecipient).toBe(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      );
      expect(payload.royaltyBps).toBe(500n);
      expect(payload.primarySaleRecipient).toBe(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      );
      expect(payload.uri).toBe("https://example.com/token");
      expect(payload.price).toBe(200000000000000000n);
      expect(payload.currency).toBe(erc20TokenContract.address);
      expect(payload.validityStartTimestamp).toBe(1635724n);
      expect(payload.validityEndTimestamp).toBe(1867260n);
      expect(payload.uid).toBe(
        "0x6162636465663132333435363738393000000000000000000000000000000000",
      );
      expect(signature.length).toBe(132);
    });

    it("should automatically encode a provided string uid", async () => {
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
        mintRequest: {
          currency: erc20TokenContract.address,
          metadata: "https://example.com/token",
          price: "0.2",
          primarySaleRecipient: TEST_ACCOUNT_A.address,
          royaltyBps: 500,
          royaltyRecipient: TEST_ACCOUNT_B.address,
          to: TEST_ACCOUNT_B.address,
          uid: "abcdef1234567890",
          validityEndTimestamp: new Date(1867260800),
          validityStartTimestamp: new Date(1635724800),
        },
      });

      expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(payload.royaltyRecipient).toBe(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      );
      expect(payload.royaltyBps).toBe(500n);
      expect(payload.primarySaleRecipient).toBe(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      );
      expect(payload.uri).toBe("https://example.com/token");
      expect(payload.price).toBe(200000000000000000n);
      expect(payload.currency).toBe(erc20TokenContract.address);
      expect(payload.validityStartTimestamp).toBe(1635724n);
      expect(payload.validityEndTimestamp).toBe(1867260n);
      expect(payload.uid).toBe(
        "0x6162636465663132333435363738393000000000000000000000000000000000",
      );
      expect(signature.length).toBe(132);
    });

    it("should default sale recipient to the contract's primarySaleRecipient when empty", async () => {
      const { payload, signature } = await generateMintSignature({
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
        mintRequest: {
          currency: erc20TokenContract.address,
          metadata: "https://example.com/token",
          price: "0.2",
          primarySaleRecipient: "",
          royaltyBps: 500,
          royaltyRecipient: "",
          to: TEST_ACCOUNT_B.address,
          uid: toHex("abcdef1234567890", { size: 32 }),
          validityEndTimestamp: new Date(1867260800),
          validityStartTimestamp: new Date(1635724800),
        },
      });

      expect(payload.royaltyRecipient).toBe(TEST_ACCOUNT_C.address);
      expect(payload.primarySaleRecipient).toBe(TEST_ACCOUNT_B.address);
      expect(signature.length).toBe(132);
    });
  },
);
