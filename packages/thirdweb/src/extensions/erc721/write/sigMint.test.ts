import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { USDT_CONTRACT_ADDRESS } from "../../../../test/src/test-contracts.js";
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
import { deployERC721Contract } from "../../prebuilts/deploy-erc721.js";
import { generateMintSignature, mintWithSignature } from "./sigMint.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)(
  "generateMintSignature",
  {
    timeout: 60000,
  },
  () => {
    let erc721Contract: ThirdwebContract;

    beforeAll(async () => {
      const contractAddress = await deployERC721Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC721",
      });
      erc721Contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
    });

    it("should generate a mint signature and mint an NFT", async () => {
      const { payload, signature } = await generateMintSignature({
        mintRequest: {
          to: TEST_ACCOUNT_B.address,
          metadata: {
            name: "My NFT",
            description: "This is my NFT",
            image: "https://example.com/image.png",
          },
        },
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
      });
      const transaction = mintWithSignature({
        contract: erc721Contract,
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
          metadata: "https://example.com/token",
        },
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
      });

      expect(payload.to).toBe("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(payload.royaltyRecipient).toBe(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      );
      expect(payload.royaltyBps).toBe(0n);
      expect(payload.primarySaleRecipient).toBe(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      );
      expect(payload.uri).toBe("https://example.com/token");
      expect(payload.price).toBe(0n);
      expect(payload.currency).toBe(NATIVE_TOKEN_ADDRESS);
      expect(payload.validityStartTimestamp).toBe(0n);
      expect(payload.validityEndTimestamp).toBeGreaterThan(0n);
      expect(payload.uid).toBeDefined();
      expect(signature.length).toBe(132);
    });

    it("should generate a mint signature with custom values", async () => {
      const { payload, signature } = await generateMintSignature({
        mintRequest: {
          to: TEST_ACCOUNT_B.address,
          royaltyRecipient: TEST_ACCOUNT_B.address,
          royaltyBps: 500,
          primarySaleRecipient: TEST_ACCOUNT_A.address,
          metadata: "https://example.com/token",
          price: 0.2,
          currency: USDT_CONTRACT_ADDRESS,
          validityStartTimestamp: new Date(1635724800), // October 31, 2021 00:00:00 UTC
          validityEndTimestamp: new Date(1667260800), // October 31, 2022 00:00:00 UTC
          uid: toHex("abcdef1234567890", { size: 32 }),
        },
        account: TEST_ACCOUNT_A,
        contract: erc721Contract,
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
      expect(payload.currency).toBe(USDT_CONTRACT_ADDRESS);
      expect(payload.validityStartTimestamp).toBe(1635724n);
      expect(payload.validityEndTimestamp).toBe(1667260n);
      expect(payload.uid).toBe(
        "0x6162636465663132333435363738393000000000000000000000000000000000",
      );
      expect(signature.length).toBe(132);
    });
  },
);
