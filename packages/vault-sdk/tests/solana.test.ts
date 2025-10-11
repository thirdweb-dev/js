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
    });
  });

  describe("Transaction Creation and Signing", () => {
    it("should create a valid transfer transaction", async () => {
      const transferAmount = lamports(100_000_000n);

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
      const transferAmount = lamports(100_000_000n);

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
      const transferAmount = lamports(100_000_000n);

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
      const transferAmount = lamports(100_000_000n);

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

  describe("Access Token - Transaction Pattern Policies", () => {
    // Helper to create a simple transfer transaction
    const createTransferTransaction = async (
      from: string,
      to: string,
      amount: bigint,
    ) => {
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
      const signer = createNoopSigner(address(from));

      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address(to),
        amount: lamports(amount),
      });

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(from), tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(transferInstruction, tx),
      );

      const compiledTransaction = compileTransaction(transactionMessage);
      return getBase64EncodedWireTransaction(compiledTransaction);
    };

    describe("Program Access Control", () => {
      it("should allow transaction with allowed program", async () => {
        // System program ID (used for transfers)
        const systemProgramId = "11111111111111111111111111111111";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "allow",
                      programs: [systemProgramId],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Allow System Program Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction with non-allowed program", async () => {
        // Only allow a different program (not system program)
        const fakeProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "allow",
                      programs: [fakeProgramId],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Restricted Program Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });

      it("should allow transaction when program is not in deny list", async () => {
        // Deny a different program (not system program)
        const fakeProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "deny",
                      programs: [fakeProgramId],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Deny List Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction when program is in deny list", async () => {
        // Deny system program
        const systemProgramId = "11111111111111111111111111111111";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "deny",
                      programs: [systemProgramId],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Deny System Program Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });
    });

    describe("Can Pay Fees", () => {
      it("should allow fee payment when canPayFees is true", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    canPayFees: true,
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Allow Fees Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny fee payment when canPayFees is false", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    canPayFees: false,
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "No Fees Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();

        expect(
          typeof signatureResult.error?.details === "object"
            ? signatureResult.error?.details.reason
            : "",
        ).toContain("not authorized to pay transaction fees");
      });

      it("should allow fee payment by default (no transactionPatterns)", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  // No transactionPatterns means default behavior (allow fees)
                },
              ],
              expiresAt,
              metadata: {
                name: "Default Behavior Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });
    });

    describe("Max Instructions", () => {
      it("should allow transaction within instruction limit", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    maxInstructions: 5, // Allow up to 5 instructions
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Max 5 Instructions Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        // Create transaction with 1 instruction
        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction exceeding instruction limit", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    maxInstructions: 0, // No instructions allowed
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Zero Instructions Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        // Create transaction with 1 instruction (exceeds limit of 0)
        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });
    });

    describe("Combined Transaction Patterns", () => {
      it("should enforce multiple patterns together", async () => {
        const systemProgramId = "11111111111111111111111111111111";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "allow",
                      programs: [systemProgramId],
                    },
                    maxInstructions: 5,
                    canPayFees: true,
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Combined Patterns Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should fail if any pattern is violated", async () => {
        const systemProgramId = "11111111111111111111111111111111";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    programs: {
                      type: "allow",
                      programs: [systemProgramId],
                    },
                    maxInstructions: 5,
                    canPayFees: false, // This will cause failure
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Combined Patterns (Violation) Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });
    });

    describe("Writable Accounts Access Control", () => {
      it("should allow transaction with allowed writable account", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    writableAccounts: {
                      type: "allow",
                      accounts: [senderPubkey, receiverPubkey],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Allow Writable Accounts Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction with non-allowed writable account", async () => {
        // Only allow sender to be writable, not receiver
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    writableAccounts: {
                      type: "allow",
                      accounts: [senderPubkey], // Only sender, not receiver
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Restricted Writable Accounts Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });

      it("should allow transaction when writable account is not in deny list", async () => {
        // Deny a different account (not sender or receiver)
        const fakeAccount = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    writableAccounts: {
                      type: "deny",
                      accounts: [fakeAccount],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Deny List Writable Accounts Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction when writable account is in deny list", async () => {
        // Deny receiver as writable
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    writableAccounts: {
                      type: "deny",
                      accounts: [receiverPubkey],
                    },
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Deny Receiver Writable Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });
    });

    describe("Required Cosigners", () => {
      it("should allow transaction without cosigners when none required", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    requiredCosigners: [], // No cosigners required
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "No Cosigners Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny transaction when required cosigner is missing", async () => {
        // Require receiver as cosigner (but it won't be in the transaction)
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    requiredCosigners: [receiverPubkey],
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Required Cosigner Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });

      it("should deny transaction when multiple required cosigners are missing", async () => {
        // Require multiple cosigners that won't be in the transaction
        const fakeCosigner1 = "CosignerAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        const fakeCosigner2 = "CosignerBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  transactionPatterns: {
                    requiredCosigners: [fakeCosigner1, fakeCosigner2],
                  },
                },
              ],
              expiresAt,
              metadata: {
                name: "Multiple Cosigners Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });

      it("should allow transaction by default when no cosigners specified", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey],
                  // No requiredCosigners field means any transaction is allowed
                },
              ],
              expiresAt,
              metadata: {
                name: "Default Cosigners Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });
    });

    describe("Allowlist", () => {
      it("should allow signing from account in allowlist", async () => {
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [senderPubkey], // Explicitly allow sender
                },
              ],
              expiresAt,
              metadata: {
                name: "Allowlist Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(true);
        expect(signatureResult.data?.signature).toBeTruthy();
      });

      it("should deny signing from account not in allowlist", async () => {
        // Create allowlist with only receiver (not sender)
        const expiresAt = new Date(Date.now() + 3600000).toISOString();
        const accessTokenResult = await createAccessToken({
          client: vaultClient,
          request: {
            auth: { adminKey },
            options: {
              policies: [
                {
                  type: "solana:signTransaction",
                  allowlist: [receiverPubkey], // Only allow receiver, not sender
                },
              ],
              expiresAt,
              metadata: {
                name: "Restricted Allowlist Token",
              },
            },
          },
        });

        expect(accessTokenResult.success).toBe(true);
        const accessToken = accessTokenResult.data?.accessToken || "";

        const base64Transaction = await createTransferTransaction(
          senderPubkey,
          receiverPubkey,
          1n,
        );

        const signatureResult = await signSolanaTransaction({
          client: vaultClient,
          request: {
            auth: { accessToken },
            options: {
              transaction: base64Transaction,
              from: senderPubkey,
            },
          },
        });

        expect(signatureResult.success).toBe(false);
        expect(signatureResult.error).toBeTruthy();
      });
    });
  });
});
