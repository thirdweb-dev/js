import {
  address,
  airdropFactory,
  appendTransactionMessageInstruction,
  type Base64EncodedWireTransaction,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  type DevnetUrl,
  devnet,
  getBase64EncodedWireTransaction,
  lamports,
  pipe,
  type Signature,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import bs58 from "bs58";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createAccessToken,
  createServiceAccount,
  createSolanaAccount,
  createVaultClient,
  signSolanaTransaction,
  type VaultClient,
} from "../src/exports/thirdweb.js";
import { reconstructSolanaSignedTransaction } from "../src/sdk.js";

// Environment variables with fallbacks
const SOLANA_RPC_HTTP_URL =
  process.env.SOLANA_RPC_HTTP_URL || "http://127.0.0.1:8899";
const SOLANA_RPC_WS_URL =
  process.env.SOLANA_RPC_WS_URL || "ws://127.0.0.1:8900";
const VAULT_URL = process.env.VAULT_URL || "http://localhost:3000";
const LAMPORTS_PER_SOL = 1_000_000_000n;

/**
 * Generate Solana explorer URL with custom RPC endpoint
 */
function getExplorerUrl(path: string, type: "address" | "tx" = "tx"): string {
  const encodedRpcUrl = encodeURIComponent(SOLANA_RPC_HTTP_URL);
  return `https://explorer.solana.com/${type}/${path}?cluster=custom&customUrl=${encodedRpcUrl}`;
}

// /**
//  * Reconstruct a signed transaction from the vault signature
//  */
// function reconstructSignedTransaction(
//   base64Transaction: string,
//   base58Signature: string,
// ): Uint8Array {
//   // Decode the base64 unsigned transaction
//   const transactionBytes = new Uint8Array(
//     Buffer.from(base64Transaction, "base64"),
//   );

//   // Decode the base58 signature
//   const signatureBytes = bs58.decode(base58Signature);

//   if (signatureBytes.length !== 64) {
//     throw new Error(
//       `Invalid signature length: ${signatureBytes.length}, expected 64`,
//     );
//   }

//   // Wire format structure:
//   // [1 byte: signature count][64 bytes per signature][message bytes]

//   // Read the signature count
//   const signatureCount = transactionBytes[0];

//   // Calculate where the message starts (after all signature slots)
//   const messageStart = 1 + signatureCount * 64;

//   // Create the signed transaction buffer
//   const signedTransaction = new Uint8Array(transactionBytes.length);

//   // Copy signature count
//   signedTransaction[0] = signatureCount;

//   // Copy the signature into the first signature slot
//   signedTransaction.set(signatureBytes, 1);

//   // Copy any remaining signature slots (should be empty/zeros)
//   if (signatureCount > 1) {
//     signedTransaction.set(transactionBytes.slice(1 + 64, messageStart), 1 + 64);
//   }

//   // Copy the message bytes
//   signedTransaction.set(transactionBytes.slice(messageStart), messageStart);

//   return signedTransaction;
// }

/**
 * Send a signed transaction to the Solana network
 */
async function sendSignedTransaction(
  rpc: ReturnType<typeof createSolanaRpc>,
  signedTransactionBytes: Uint8Array,
): Promise<string> {
  const base64SignedTransaction = Buffer.from(signedTransactionBytes).toString(
    "base64",
  );

  const response = await rpc
    .sendTransaction(base64SignedTransaction as Base64EncodedWireTransaction, {
      encoding: "base64",
      skipPreflight: false,
      preflightCommitment: "confirmed",
    })
    .send();

  return response;
}

describe("Solana Vault Integration Tests", () => {
  let vaultClient: VaultClient;
  let adminKey: string;
  let senderPubkey: string;
  let receiverPubkey: string;
  let rpc: ReturnType<typeof createSolanaRpc<DevnetUrl>>;
  let rpcSubscriptions: ReturnType<
    typeof createSolanaRpcSubscriptions<DevnetUrl>
  >;

  beforeAll(async () => {
    // Setup RPC connections
    rpc = createSolanaRpc(devnet(SOLANA_RPC_HTTP_URL));
    rpcSubscriptions = createSolanaRpcSubscriptions(devnet(SOLANA_RPC_WS_URL));

    // Create vault client
    vaultClient = await createVaultClient({ baseUrl: VAULT_URL });

    // Create service account
    const serviceAccountResult = await createServiceAccount({
      client: vaultClient,
      request: {
        options: {
          metadata: {
            name: "Solana Test Service Account",
            description: "Testing Solana integration",
          },
        },
      },
    });

    adminKey = serviceAccountResult.data?.adminKey || "";
    expect(adminKey).toBeTruthy();

    // Create sender account
    const senderAccount = await createSolanaAccount({
      client: vaultClient,
      request: {
        auth: { adminKey },
        options: {
          metadata: {
            name: "Test Sender",
            purpose: "Sender account for tests",
          },
        },
      },
    });

    // Create receiver account
    const receiverAccount = await createSolanaAccount({
      client: vaultClient,
      request: {
        auth: { adminKey },
        options: {
          metadata: {
            name: "Test Receiver",
            purpose: "Receiver account for tests",
          },
        },
      },
    });

    senderPubkey = senderAccount.data?.pubkey || "";
    receiverPubkey = receiverAccount.data?.pubkey || "";

    expect(senderPubkey).toBeTruthy();
    expect(receiverPubkey).toBeTruthy();

    console.log("\n=== Account Setup ===");
    console.log(`Sender account: ${senderPubkey}`);
    console.log(`View sender: ${getExplorerUrl(senderPubkey, "address")}`);
    console.log(`Receiver account: ${receiverPubkey}`);
    console.log(`View receiver: ${getExplorerUrl(receiverPubkey, "address")}`);

    // Airdrop minimal SOL to sender (just enough for tx fees + transfers)
    // ~5000 lamports per tx fee * 4 txs + 4 lamports for transfers = ~20004 lamports
    console.log("\n=== Airdrop ===");
    console.log("Requesting airdrop of 3000000000 lamports (3 SOL)...");
    const airdrop = airdropFactory({ rpc, rpcSubscriptions });
    const airdropSignature = await airdrop({
      commitment: "confirmed",
      recipientAddress: address(senderPubkey),
      lamports: lamports(3_000_000_000n), // 3 SOL for tests
    });

    console.log(`Airdrop signature: ${airdropSignature}`);
    console.log(`View airdrop: ${getExplorerUrl(airdropSignature)}`);

    // Wait a bit for airdrop to confirm
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }, 60000); // 60 second timeout for setup

  describe("Vault Health Check", () => {
    it("should successfully connect to vault", async () => {
      const response = await fetch(`${VAULT_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      expect(response.ok).toBe(true);
    });
  });

  describe("Account Management", () => {
    it("should have created sender account with valid pubkey", () => {
      expect(senderPubkey).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
    });

    it("should have created receiver account with valid pubkey", () => {
      expect(receiverPubkey).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
    });

    it("should have different pubkeys for sender and receiver", () => {
      expect(senderPubkey).not.toBe(receiverPubkey);
    });
  });

  describe("Access Token - Solana Account Creation", () => {
    it("should create a Solana account using an access token", async () => {
      // Create an access token with solana:create permission
      const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const accessTokenResult = await createAccessToken({
        client: vaultClient,
        request: {
          auth: { adminKey },
          options: {
            policies: [
              {
                type: "solana:create",
                allowedMetadataPatterns: [
                  {
                    key: "purpose",
                    rule: { pattern: ".*" }, // Allow any purpose
                  },
                  {
                    key: "name",
                    rule: { pattern: ".*" },
                  },
                ],
              },
              {
                type: "solana:read",
                metadataPatterns: [
                  {
                    key: "purpose",
                    rule: { pattern: ".*" }, // Allow reading any
                  },
                ],
              },
            ],
            expiresAt,
            metadata: {
              name: "Solana Access Token",
              description: "Token for creating Solana accounts",
            },
          },
        },
      });

      expect(accessTokenResult.success).toBe(true);
      expect(accessTokenResult.data?.accessToken).toBeTruthy();

      const accessToken = accessTokenResult.data?.accessToken || "";
      console.log("\n=== Access Token Created ===");
      console.log(`Access Token ID: ${accessTokenResult.data?.id}`);

      // Use the access token to create a new Solana account
      const accountResult = await createSolanaAccount({
        client: vaultClient,
        request: {
          auth: { accessToken },
          options: {
            metadata: {
              name: "Access Token Created Account",
              purpose: "Testing access token creation",
            },
          },
        },
      });

      expect(accountResult.success).toBe(true);
      expect(accountResult.data?.pubkey).toBeTruthy();
      expect(accountResult.data?.pubkey).toMatch(
        /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      );

      console.log("\n=== Account Created via Access Token ===");
      console.log(`Account pubkey: ${accountResult.data?.pubkey}`);
      console.log(
        `View account: ${getExplorerUrl(accountResult.data?.pubkey || "", "address")}`,
      );
      console.log(`Created at: ${accountResult.data?.createdAt}`);
    });

    it("should fail to create account without proper permissions", async () => {
      // Create an access token without solana:create permission (only read)
      const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const accessTokenResult = await createAccessToken({
        client: vaultClient,
        request: {
          auth: { adminKey },
          options: {
            policies: [
              {
                type: "solana:read",
                metadataPatterns: [
                  {
                    key: "purpose",
                    rule: { pattern: ".*" },
                  },
                ],
              },
            ],
            expiresAt,
            metadata: {
              name: "Read-Only Token",
              description: "Token without create permission",
            },
          },
        },
      });

      expect(accessTokenResult.success).toBe(true);
      const accessToken = accessTokenResult.data?.accessToken || "";

      // Attempt to create account should fail
      const accountResult = await createSolanaAccount({
        client: vaultClient,
        request: {
          auth: { accessToken },
          options: {
            metadata: {
              name: "Should Fail",
              purpose: "This should not work",
            },
          },
        },
      });

      expect(accountResult.success).toBe(false);
      expect(accountResult.error).toBeTruthy();
      console.log("\n=== Expected Failure (No Create Permission) ===");
      console.log(`Error: ${accountResult.error}`);
    });
  });

  describe("Transaction Creation and Signing", () => {
    it("should create a valid transfer transaction", async () => {
      const transferAmount = lamports(100_000_000n); // 1 lamport - minimum possible

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
      expect(latestBlockhash.blockhash).toBeTruthy();

      const signer = createNoopSigner(address(senderPubkey));

      // Create transfer instruction
      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address(receiverPubkey),
        amount: transferAmount,
      });

      // Build transaction message
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(senderPubkey), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
      );

      // Compile transaction
      const compiledTransaction = compileTransaction(transactionMessage);
      const base64Transaction =
        getBase64EncodedWireTransaction(compiledTransaction);

      expect(base64Transaction).toBeTruthy();
      expect(base64Transaction.length).toBeGreaterThan(0);
    });

    it("should sign transaction with vault and return valid signature", async () => {
      const transferAmount = lamports(100_000_000n); // 1 lamport - minimum possible

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      const signer = createNoopSigner(address(senderPubkey));

      // Create transfer instruction
      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address(receiverPubkey),
        amount: transferAmount,
      });

      // Build transaction message
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(senderPubkey), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
      );

      // Compile and encode
      const compiledTransaction = compileTransaction(transactionMessage);
      const base64Transaction =
        getBase64EncodedWireTransaction(compiledTransaction);

      // Sign with vault
      const signatureResult = await signSolanaTransaction({
        client: vaultClient,
        request: {
          auth: { adminKey },
          options: {
            transaction: base64Transaction,
            from: senderPubkey,
          },
        },
      });

      expect(signatureResult.success).toBe(true);
      expect(signatureResult.data?.signature).toBeTruthy();
      expect(signatureResult.data?.signerPubkey).toBe(senderPubkey);

      // Validate signature format (base58)
      const signature = signatureResult.data?.signature || "";
      expect(signature).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);

      // Decode to verify it's 64 bytes
      const signatureBytes = bs58.decode(signature);
      expect(signatureBytes.length).toBe(64);
    });
  });

  describe("End-to-End Transfer", () => {
    it("should create, sign, and broadcast a SOL transfer", async () => {
      const transferAmount = lamports(100_000_000n); // 1 lamport - minimum possible

      // Get sender's initial balance
      const initialBalance = await rpc.getBalance(address(senderPubkey)).send();
      console.log(
        `Initial sender balance: ${Number(initialBalance.value) / Number(LAMPORTS_PER_SOL)} SOL`,
      );

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      const signer = createNoopSigner(address(senderPubkey));

      // Create transfer instruction
      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address(receiverPubkey),
        amount: transferAmount,
      });

      // Build transaction message
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(senderPubkey), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
      );

      // Compile and encode
      const compiledTransaction = compileTransaction(transactionMessage);
      const base64Transaction =
        getBase64EncodedWireTransaction(compiledTransaction);

      // Sign with vault
      const signatureResult = await signSolanaTransaction({
        client: vaultClient,
        request: {
          auth: { adminKey },
          options: {
            transaction: base64Transaction,
            from: senderPubkey,
          },
        },
      });

      expect(signatureResult.success).toBe(true);
      if (!signatureResult.success) {
        throw new Error("Failed to sign transaction");
      }

      const { signature, signerPubkey } = signatureResult.data;
      expect(signerPubkey).toBe(senderPubkey);

      // Reconstruct signed transaction
      const signedTransactionBytes = reconstructSolanaSignedTransaction(
        base64Transaction,
        signature,
        senderPubkey,
      );

      expect(signedTransactionBytes.length).toBeGreaterThan(0);

      // Send transaction to network
      const txSignature = await sendSignedTransaction(
        rpc,
        signedTransactionBytes,
      );

      expect(txSignature).toBeTruthy();
      expect(typeof txSignature).toBe("string");

      console.log("\n=== Transfer Transaction ===");
      console.log(`Transaction signature: ${txSignature}`);
      console.log(`View transaction: ${getExplorerUrl(txSignature)}`);

      // Wait for confirmation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Verify transaction was successful
      const txDetails = await rpc
        .getTransaction(txSignature as Signature, {
          encoding: "json",
          maxSupportedTransactionVersion: 0,
        })
        .send();

      expect(txDetails).toBeTruthy();
      expect(txDetails?.meta?.err).toBeNull();

      // Get final balance
      const finalBalance = await rpc.getBalance(address(senderPubkey)).send();
      console.log(
        `Final sender balance: ${Number(finalBalance.value) / Number(LAMPORTS_PER_SOL)} SOL`,
      );

      // Balance should have decreased (transfer amount + fees)
      expect(Number(finalBalance.value)).toBeLessThan(
        Number(initialBalance.value),
      );
    }, 30000); // 30 second timeout for network operations
  });

  describe("Multiple Transfers", () => {
    it("should handle multiple sequential transfers", async () => {
      const numTransfers = 3;
      const transferAmount = lamports(100_000_000n); // 1 lamport each - minimum possible

      const signatures: string[] = [];

      for (let i = 0; i < numTransfers; i++) {
        console.log(`\nProcessing transfer ${i + 1}/${numTransfers}...`);

        // Get latest blockhash (fresh for each transaction)
        const { value: latestBlockhash } = await rpc
          .getLatestBlockhash()
          .send();

        const signer = createNoopSigner(address(senderPubkey));

        // Create transfer instruction
        const transferInstruction = getTransferSolInstruction({
          source: signer,
          destination: address(receiverPubkey),
          amount: transferAmount,
        });

        // Build transaction
        const transactionMessage = pipe(
          createTransactionMessage({ version: 0 }),
          (tx) => setTransactionMessageFeePayer(address(senderPubkey), tx),
          (tx) =>
            setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
          (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
        );

        const compiledTransaction = compileTransaction(transactionMessage);
        const base64Transaction =
          getBase64EncodedWireTransaction(compiledTransaction);

        // Sign with vault
        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        if (!signatureResult.success) continue;

        // Reconstruct and send
        const signedTransactionBytes = reconstructSolanaSignedTransaction(
          base64Transaction,
          signatureResult.data.signature,
          senderPubkey,
        );

        const txSignature = await sendSignedTransaction(
          rpc,
          signedTransactionBytes,
        );

        signatures.push(txSignature);
        console.log(`Transfer ${i + 1} signature: ${txSignature}`);
        console.log(`View transfer ${i + 1}: ${getExplorerUrl(txSignature)}`);

        // Wait between transactions
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      expect(signatures.length).toBe(numTransfers);
      console.log(`\n=== Summary ===`);
      console.log(`Completed ${numTransfers} transfers successfully!`);
      for (let i = 0; i < signatures.length; i++) {
        console.log(`Transfer ${i + 1}: ${getExplorerUrl(signatures[i])}`);
      }
    }, 60000); // 60 second timeout
  });
});
