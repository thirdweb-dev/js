#!/usr/bin/env tsx

/**
 * Comprehensive Solana Integration Test
 * Tests the vault SDK with Solana operations
 */

import {
	createServiceAccount,
	createSolanaAccount,
	createVaultClient,
	listSolanaAccounts,
	signSolanaMessage,
	signSolanaTransaction,
	type VaultClient,
} from "./src/exports/thirdweb.js";
// Vault SDK imports
import type { SolanaVersionedMessage } from "./src/types.js";

const VAULT_URL = "http://localhost:3000";

async function main(): Promise<void> {
	console.log("🚀 Starting Solana Integration Test...\n");
	console.log("🔧 Configuration:");
	console.log(`   Vault URL: ${VAULT_URL}`);
	console.log(`   Node version: ${process.version}`);
	console.log(`   Platform: ${process.platform}\n`);

	// Test basic connectivity
	console.log("🔍 Testing vault connectivity...");
	try {
		const response = await fetch(`${VAULT_URL}/health`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		console.log(`   Health check status: ${response.status}`);
		console.log(`   Health check ok: ${response.ok}`);

		if (response.ok) {
			const healthData = await response.text();
			console.log(`   Health response: ${healthData}`);
		}
	} catch (healthError) {
		console.warn(
			"⚠️  Health check failed:",
			healthError instanceof Error ? healthError.message : healthError,
		);
		console.warn("   Continuing with test anyway...");
	}
	console.log();

	try {
		// Step 1: Create Vault Client
		console.log("📡 Creating vault client...");
		console.log(`   Connecting to: ${VAULT_URL}`);

		const vaultClient: VaultClient = await createVaultClient({
			baseUrl: VAULT_URL,
		});

		console.log("✅ Vault client created successfully");
		console.log(`   Client type: ${typeof vaultClient}`);
		console.log(`   Client keys: ${Object.keys(vaultClient)}\n`);

		// Step 2: Create Service Account
		console.log("👤 Creating service account...");
		console.log(
			"   Request payload:",
			JSON.stringify(
				{
					options: {
						metadata: {
							name: "Solana Test Service Account",
							description: "Testing Solana integration",
						},
					},
				},
				null,
				2,
			),
		);

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

		console.log("✅ Service account response received");
		console.log(
			"   Response structure:",
			JSON.stringify(serviceAccountResult, null, 2),
		);
		console.log("   Service account ID:", serviceAccountResult.data?.id);
		console.log("   Admin key present:", !!serviceAccountResult.data?.adminKey);
		console.log(
			"   Admin key length:",
			serviceAccountResult.data?.adminKey?.length || 0,
			"\n",
		);

		const adminKey: string = serviceAccountResult.data?.adminKey || "";
		if (!adminKey) {
			console.error("❌ No admin key in response!");
			console.error(
				"   Full response:",
				JSON.stringify(serviceAccountResult, null, 2),
			);
			throw new Error("Failed to get admin key from service account creation");
		}

		// Step 3: Create First Solana Account
		console.log("🌟 Creating first Solana account...");
		console.log("   Using admin key:", `${adminKey.substring(0, 10)}...`);
		console.log(
			"   Request payload:",
			JSON.stringify(
				{
					auth: { adminKey: `${adminKey.substring(0, 10)}...` },
					options: {
						metadata: {
							name: "Test Account 1",
							purpose: "Primary test account",
						},
					},
				},
				null,
				2,
			),
		);

		const solanaAccount1 = await createSolanaAccount({
			client: vaultClient,
			request: {
				auth: { adminKey },
				options: {
					metadata: {
						name: "Test Account 1",
						purpose: "Primary test account",
					},
				},
			},
		});

		console.log("✅ First Solana account response received");
		console.log(
			"   Response structure:",
			JSON.stringify(solanaAccount1, null, 2),
		);
		console.log("   Account address:", solanaAccount1.data?.address);
		console.log("   Public key:", solanaAccount1.data?.publicKey);
		console.log(
			"   Metadata:",
			JSON.stringify(solanaAccount1.data?.metadata, null, 2),
			"\n",
		);

		// Step 4: Create Second Solana Account
		console.log("🌟 Creating second Solana account...");
		const solanaAccount2 = await createSolanaAccount({
			client: vaultClient,
			request: {
				auth: { adminKey },
				options: {
					metadata: {
						name: "Test Account 2",
						purpose: "Secondary test account",
					},
				},
			},
		});

		console.log("✅ Second Solana account response received");
		console.log(
			"   Response structure:",
			JSON.stringify(solanaAccount2, null, 2),
		);
		console.log("   Account address:", solanaAccount2.data?.address);
		console.log("   Public key:", solanaAccount2.data?.publicKey, "\n");

		// Step 5: List Solana Accounts
		console.log("📋 Listing Solana accounts...");
		const accountsList = await listSolanaAccounts({
			client: vaultClient,
			request: {
				auth: { adminKey },
				options: {
					page: 1,
					pageSize: 10,
				},
			},
		});

		console.log("✅ List accounts response received");
		console.log(
			"   Response structure:",
			JSON.stringify(accountsList, null, 2),
		);
		console.log("   Total count:", accountsList.data?.totalCount);
		console.log("   Accounts found:", accountsList.data?.accounts?.length || 0);

		accountsList.data?.accounts?.forEach((acc, i) => {
			console.log(
				`   ${i + 1}. ${acc.address} (${acc.metadata?.name || "No name"})`,
			);
		});
		console.log();

		// Step 6: Create Test Transaction Message
		console.log("💸 Creating test transaction message...");
		const transferAmount: bigint = 500_000_000n; // 0.5 SOL

		// Ensure we have the account data
		if (!solanaAccount1.data?.publicKey || !solanaAccount2.data?.publicKey) {
			throw new Error("Missing account data");
		}

		console.log("✅ Test transaction message prepared");
		console.log("📦 Transfer amount:", transferAmount / 1_000_000_000n, "SOL");
		console.log("👤 From:", solanaAccount1.data.publicKey);
		console.log("👤 To:", solanaAccount2.data.publicKey, "\n");

		// Step 7: Sign Transaction with Vault
		console.log("✍️  Signing transaction with vault...");

		// Create a simple test transaction message
		const vaultMessage: SolanaVersionedMessage = {
			version: "legacy",
			header: {
				numRequiredSignatures: 1,
				numReadonlySignedAccounts: 0,
				numReadonlyUnsignedAccounts: 1,
			},
			staticAccountKeys: [
				solanaAccount1.data.publicKey,
				solanaAccount2.data.publicKey,
				"11111111111111111111111111111111", // System program
			],
			recentBlockhash: "11111111111111111111111111111111111111111111", // Dummy blockhash for testing
			instructions: [
				{
					programIdIndex: 2, // System program
					accountKeyIndexes: [0, 1], // From and to accounts
					data: new Uint8Array([2, 0, 0, 0, 0, 202, 154, 59, 0, 0, 0, 0]), // Transfer 0.5 SOL
				},
			],
		};

		console.log(
			"   Transaction message:",
			JSON.stringify(vaultMessage, null, 2),
		);
		console.log("   Signing with account:", solanaAccount1.data.publicKey);

		const signatureResult = await signSolanaTransaction({
			client: vaultClient,
			request: {
				auth: { adminKey },
				options: {
					message: vaultMessage,
					from: solanaAccount1.data.publicKey,
				},
			},
		});

		console.log("✅ Transaction signing response received");
		console.log(
			"   Response structure:",
			JSON.stringify(signatureResult, null, 2),
		);
		console.log("   Signature:", signatureResult.data?.signature);
		console.log("   Signer pubkey:", signatureResult.data?.signerPubkey, "\n");

		// Step 8: Test Message Signing
		console.log("📝 Testing message signing...");
		const testMessage = "Hello from Solana Vault Integration Test!";
		console.log("   Message to sign:", testMessage);
		console.log("   Signing with account:", solanaAccount1.data.publicKey);

		const messageSignature = await signSolanaMessage({
			client: vaultClient,
			request: {
				auth: { adminKey },
				options: {
					message: testMessage,
					from: solanaAccount1.data.publicKey,
					format: "text",
				},
			},
		});

		console.log("✅ Message signing response received");
		console.log(
			"   Response structure:",
			JSON.stringify(messageSignature, null, 2),
		);
		console.log("   Signature:", messageSignature.data?.signature);
		console.log(
			"   Signed message:",
			messageSignature.data?.signedMessage,
			"\n",
		);

		// Step 9: Summary
		console.log("🎉 Test Summary:");
		console.log("================");
		console.log("✅ Vault client created");
		console.log("✅ Service account created");
		console.log("✅ Two Solana accounts created");
		console.log("✅ Accounts listed successfully");
		console.log("✅ Transaction message created");
		console.log("✅ Transaction signed with vault");
		console.log("✅ Message signing tested");
		console.log("\n🔍 Explorer Links:");
		console.log(
			`   Account 1: https://explorer.solana.com/address/${solanaAccount1.data?.publicKey}?cluster=devnet`,
		);
		console.log(
			`   Account 2: https://explorer.solana.com/address/${solanaAccount2.data?.publicKey}?cluster=devnet`,
		);

		console.log("\n🎯 All tests completed successfully!");
		console.log("\n💡 Next steps:");
		console.log("   1. Fund the accounts using the Solana faucet");
		console.log(
			"   2. Use a Solana client library to create real transactions",
		);
		console.log("   3. Sign them with the vault and submit to the network");
	} catch (error: unknown) {
		console.error("\n❌ Test failed!");
		console.error("================");

		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Stack trace:", error.stack);

			// Check for network errors
			if (error.message.includes("ECONNREFUSED")) {
				console.error("\n🔍 Network Error Details:");
				console.error("   - Connection refused to vault server");
				console.error("   - Make sure the vault is running on", VAULT_URL);
				console.error("   - Check if the port is correct (3000)");
			}

			// Check for HTTP errors
			if (error.message.includes("fetch")) {
				console.error("\n🔍 HTTP Error Details:");
				console.error("   - Failed to make HTTP request");
				console.error("   - Vault URL:", VAULT_URL);
				console.error("   - Check network connectivity");
			}

			// Check for JSON parsing errors
			if (error.message.includes("JSON")) {
				console.error("\n🔍 JSON Error Details:");
				console.error("   - Failed to parse response");
				console.error("   - Server might be returning non-JSON response");
			}
		} else {
			console.error("Unknown error type:", typeof error);
			console.error("Error value:", error);
		}

		console.error("\n💡 Troubleshooting steps:");
		console.error("   1. Ensure the vault server is running");
		console.error("   2. Check the vault URL and port");
		console.error("   3. Verify network connectivity");
		console.error("   4. Check vault logs for errors");

		process.exit(1);
	}
}

// Run the test
main().catch(console.error);
