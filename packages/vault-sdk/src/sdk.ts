import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { x25519 } from "@noble/curves/ed25519";
import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import type { TypedData } from "abitype";
import * as jose from "jose";

// Base58 encoding for Solana public keys
const BASE58_ALPHABET =
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Encode(bytes: number[] | Uint8Array): string {
	const byteArray = Array.isArray(bytes) ? new Uint8Array(bytes) : bytes;

	if (byteArray.length === 0) return "";

	// Convert to big integer
	let num = 0n;
	for (const byte of byteArray) {
		num = num * 256n + BigInt(byte);
	}

	// Convert to base58
	let result = "";
	while (num > 0n) {
		const remainder = Number(num % 58n);
		result = BASE58_ALPHABET[remainder] + result;
		num = num / 58n;
	}

	// Add leading zeros
	for (const byte of byteArray) {
		if (byte === 0) {
			result = BASE58_ALPHABET[0] + result;
		} else {
			break;
		}
	}

	return result;
}

// Helper function to process Solana account data
function _processSolanaAccountData(accountData: any): any {
	if (!accountData) return accountData;

	// If we have a pubkey byte array, convert it to base58 string
	if (accountData.pubkey && Array.isArray(accountData.pubkey)) {
		accountData.publicKey = base58Encode(accountData.pubkey);
		accountData.address = accountData.publicKey; // Use the same value for address
	}

	return accountData;
}

import type {
	CheckedSignTypedDataPayload,
	CreateAccessTokenPayload,
	CreateEoaPayload,
	CreateServiceAccountPayload,
	CreateSolanaAccountPayload,
	EncryptedPayload,
	GetServiceAccountPayload,
	ListAccessTokensPayload,
	ListEoaPayload,
	ListSolanaAccountsPayload,
	Payload,
	PingPayload,
	PolicyComponent,
	Prettify,
	RevokeAccessTokenPayload,
	RotateServiceAccountPayload,
	SignAuthorizationPayload,
	SignMessagePayload,
	SignSolanaMessagePayload,
	SignSolanaTransactionPayload,
	SignStructuredMessagePayload,
	SignTransactionPayload,
	UnencryptedErrorResponse,
} from "./types.js";

function encryptForEnclave(
	payload: Payload["input"],
	enclavePublicKey: Uint8Array,
): { encryptedPayload: EncryptedPayload; ephemeralPrivateKey: Uint8Array } {
	const ephemeralPrivateKey = randomBytes(32);
	// Generate ephemeral keypair
	const ephemeralPublicKey = x25519.getPublicKey(ephemeralPrivateKey);

	// Derive shared secret using X25519
	const sharedSecret = x25519.getSharedSecret(
		ephemeralPrivateKey,
		enclavePublicKey,
	);

	// Key derivation
	const encryptionKey = hkdf(sha256, sharedSecret, undefined, "encryption", 32);

	// Convert message to bytes if it's not already
	const messageBytes =
		typeof payload === "string"
			? new TextEncoder().encode(payload)
			: new TextEncoder().encode(JSON.stringify(payload));

	// XChaCha20-Poly1305 encryption
	const nonce = randomBytes(24); // 24-byte nonce for XChaCha20
	const cipher = xchacha20poly1305(encryptionKey, nonce);
	const ciphertext = cipher.encrypt(messageBytes);

	// Format the encrypted package
	return {
		encryptedPayload: {
			ciphertext: bytesToHex(ciphertext),
			ephemeralPublicKey: bytesToHex(ephemeralPublicKey),
			nonce: bytesToHex(nonce),
		},
		ephemeralPrivateKey: ephemeralPrivateKey,
	};
}

function isErrorResponse(
	response: UnencryptedErrorResponse | EncryptedPayload,
): response is UnencryptedErrorResponse {
	return (response as UnencryptedErrorResponse).error !== undefined;
}

function decryptFromEnclave(
	encryptedPackage: EncryptedPayload,
	ephemeralPrivateKey: Uint8Array,
) {
	const { ephemeralPublicKey, nonce, ciphertext } = encryptedPackage;

	// Convert hex strings back to bytes
	const pubKey = hexToBytes(ephemeralPublicKey);
	const nonceBytes = hexToBytes(nonce);
	const ciphertextBytes = hexToBytes(ciphertext);

	// Derive the same shared secret (from the enclave's ephemeral public key)
	const sharedSecret = x25519.getSharedSecret(ephemeralPrivateKey, pubKey);
	// Derive the same encryption key
	const encryptionKey = hkdf(sha256, sharedSecret, undefined, "encryption", 32);

	// Decrypt the ciphertext
	const cipher = xchacha20poly1305(encryptionKey, nonceBytes);
	const decrypted = cipher.decrypt(ciphertextBytes);

	// Convert bytes back to string and parse JSON if needed
	const decryptedText = new TextDecoder().decode(decrypted);
	try {
		return JSON.parse(decryptedText);
	} catch {
		return decryptedText;
	}
}

export type VaultClient = {
	baseUrl: string;
	publicKey: Uint8Array;
	headers: Record<string, string>;
};

export async function createVaultClient(clientOptions?: {
	baseUrl?: string;
	secretKey?: string;
}): Promise<VaultClient> {
	const baseUrl = clientOptions?.baseUrl ?? "https://engine.thirdweb.com";
	// Construct the full URL for the fetch call
	const url = new URL("api/v1/enclave", baseUrl).toString();

	type IntrospectionResponse = {
		publicKey: string;
	};

	const headers = {
		// Indicate we accept JSON responses
		Accept: "application/json",
		...(clientOptions?.secretKey
			? { "x-secret-key": clientOptions?.secretKey }
			: {}),
	};

	try {
		const response = await fetch(url, {
			headers,
			method: "GET",
		});

		// fetch doesn't throw on HTTP errors (like 4xx, 5xx) by default.
		// Check if the request was successful (status in the range 200-299).
		if (!response.ok) {
			// You might want more sophisticated error handling here,
			// potentially trying to parse an error message from the response body.
			throw new Error(
				`Failed to fetch enclave public key: ${response.status} ${response.statusText}`,
			);
		}

		// Parse the JSON response body
		const data = (await response.json()) as IntrospectionResponse;

		if (!data.publicKey) {
			throw new Error("Invalid response format: publicKey missing");
		}

		const publicKeyBytes = hexToBytes(data.publicKey);

		return {
			baseUrl, // Store baseUrl
			headers,
			publicKey: publicKeyBytes,
		};
	} catch (error) {
		// Handle network errors or JSON parsing errors
		throw new Error(`Failed to fetch enclave public key: ${error}`); // Re-throw or handle as appropriate for your application
	}
}

// ========== Main API function ==========
type SendRequestParams<P extends Payload> = {
	request: P["input"];
	client: VaultClient;
};

async function sendRequest<P extends Payload>({
	request,
	client,
}: SendRequestParams<P>): Promise<Prettify<P["output"]>> {
	const { encryptedPayload, ephemeralPrivateKey } = encryptForEnclave(
		request,
		client.publicKey,
	);

	// Construct the full URL using the client's baseUrl
	const url = new URL("api/v1/enclave", client.baseUrl).toString();

	try {
		const response = await fetch(url, {
			// Stringify the JSON payload for the request body
			body: JSON.stringify(encryptedPayload),
			headers: {
				...client.headers,
				Accept: "application/json",
				"Content-Type": "application/json", // Good practice to specify accept header
			},
			method: "POST",
		});

		// IMPORTANT: Replicate ky's throwHttpErrors: false behavior.
		// We proceed to parse the body regardless of response.ok status,
		// as the body itself might contain the structured error (UnencryptedErrorResponse)
		// or the encrypted success payload.

		let responseData: EncryptedPayload | UnencryptedErrorResponse;
		try {
			responseData = await response.json();
		} catch (parseError) {
			// If JSON parsing fails (e.g., 500 error with HTML body),
			// construct a generic error response.
			return {
				data: null,
				error: {
					code: "FETCH_PARSE_ERROR",
					message: `Failed to parse response: ${
						response.status
					} ${response.statusText}. ${
						parseError instanceof Error
							? parseError.message
							: String(parseError)
					}`,
				},
				success: false,
			} as Prettify<P["output"]>; // Cast needed because error isn't strictly EncryptedError | UnencryptedError
		}

		// Now check if the *parsed* response indicates an error
		if (isErrorResponse(responseData)) {
			console.error("🚨 Error response from enclave:", responseData);
			return {
				data: null,
				error: responseData.error,
				success: false, // Use the error from the response body
			} as Prettify<P["output"]>;
		}

		// If it's not an error response, it must be the EncryptedPayload
		const decryptedResponse = decryptFromEnclave(
			responseData, // No need for 'as EncryptedPayload' if isErrorResponse is accurate
			ephemeralPrivateKey,
		);

		// The decrypted response should match the expected success structure P["output"]
		// which includes { success: true, data: ..., error: null }
		return decryptedResponse as Prettify<P["output"]>;
	} catch (error) {
		// Catch network errors during the fetch itself
		return {
			data: null,
			error: {
				code: "FETCH_NETWORK_ERROR",
				message:
					error instanceof Error ? error.message : "Unknown network error",
			},
			success: false,
		} as Prettify<P["output"]>; // Cast needed
	}
}

// ========== Generic Helper Params ==========
type PayloadParams<P extends Payload> = {
	request: Prettify<Omit<P["input"], "operation">>;
	client: VaultClient;
};

// ========== Helper functions ==========
export function ping({ client, request: options }: PayloadParams<PingPayload>) {
	return sendRequest<PingPayload>({
		client,
		request: {
			operation: "ping",
			...options,
		},
	});
}

export function createServiceAccount({
	client,
	request: options,
}: PayloadParams<CreateServiceAccountPayload>) {
	return sendRequest<CreateServiceAccountPayload>({
		client,
		request: {
			operation: "serviceAccount:create",
			...options,
		},
	});
}

export function getServiceAccount({
	client,
	request: options,
}: PayloadParams<GetServiceAccountPayload>) {
	return sendRequest<GetServiceAccountPayload>({
		client,
		request: {
			operation: "serviceAccount:get",
			...options,
		},
	});
}

export function rotateServiceAccount({
	client,
	request: options,
}: PayloadParams<RotateServiceAccountPayload>) {
	return sendRequest<RotateServiceAccountPayload>({
		client,
		request: {
			operation: "serviceAccount:rotate",
			...options,
		},
	});
}

export function createEoa({
	client,
	request: options,
}: PayloadParams<CreateEoaPayload>) {
	return sendRequest<CreateEoaPayload>({
		client,
		request: {
			operation: "eoa:create",
			...options,
		},
	});
}

export function listEoas({
	client,
	request: options,
}: PayloadParams<ListEoaPayload>) {
	return sendRequest<ListEoaPayload>({
		client,
		request: {
			operation: "eoa:list",
			...options,
		},
	});
}

export function signTransaction({
	client,
	request: options,
}: PayloadParams<SignTransactionPayload>) {
	return sendRequest<SignTransactionPayload>({
		client,
		request: {
			operation: "eoa:signTransaction",
			...options,
		},
	});
}

export function signMessage({
	client,
	request: options,
}: PayloadParams<SignMessagePayload>) {
	return sendRequest<SignMessagePayload>({
		client,
		request: {
			operation: "eoa:signMessage",
			...options,
		},
	});
}

export function createAccessToken({
	client,
	request: options,
}: PayloadParams<CreateAccessTokenPayload>) {
	return sendRequest<CreateAccessTokenPayload>({
		client,
		request: {
			operation: "accessToken:create",
			...options,
		},
	});
}

export function signTypedData<
	Types extends TypedData,
	PrimaryType extends keyof Types,
>({
	client,
	request: options,
}: PayloadParams<CheckedSignTypedDataPayload<Types, PrimaryType>>) {
	return sendRequest<CheckedSignTypedDataPayload<Types, PrimaryType>>({
		client,
		request: {
			auth: options.auth,
			operation: "eoa:signTypedData",
			options: {
				from: options.options.from,
				typedData: options.options.typedData,
			},
		},
	});
}

export function revokeAccessToken({
	client,
	request: options,
}: PayloadParams<RevokeAccessTokenPayload>) {
	return sendRequest<RevokeAccessTokenPayload>({
		client,
		request: {
			operation: "accessToken:revoke",
			...options,
		},
	});
}

export function signAuthorization({
	client,
	request: options,
}: PayloadParams<SignAuthorizationPayload>) {
	return sendRequest<SignAuthorizationPayload>({
		client,
		request: {
			operation: "eoa:signAuthorization",
			...options,
		},
	});
}

export function signStructuredMessage({
	client,
	request: options,
}: PayloadParams<SignStructuredMessagePayload>) {
	return sendRequest<SignStructuredMessagePayload>({
		client,
		request: {
			operation: "eoa:signStructuredMessage",
			...options,
		},
	});
}

export function listAccessTokens({
	client,
	request: options,
}: PayloadParams<ListAccessTokensPayload>) {
	return sendRequest<ListAccessTokensPayload>({
		client,
		request: {
			operation: "accessToken:list",
			...options,
		},
	});
}

// ========== Solana Functions ==========

export function createSolanaAccount({
	client,
	request: options,
}: PayloadParams<CreateSolanaAccountPayload>) {
	return sendRequest<CreateSolanaAccountPayload>({
		client,
		request: {
			operation: "solana:create",
			...options,
		},
	});
}

export function listSolanaAccounts({
	client,
	request: options,
}: PayloadParams<ListSolanaAccountsPayload>) {
	return sendRequest<ListSolanaAccountsPayload>({
		client,
		request: {
			operation: "solana:list",
			...options,
		},
	});
}

export function signSolanaTransaction({
	client,
	request: options,
}: PayloadParams<SignSolanaTransactionPayload>) {
	return sendRequest<SignSolanaTransactionPayload>({
		client,
		request: {
			operation: "solana:signTransaction",
			...options,
		},
	});
}

export function signSolanaMessage({
	client,
	request: options,
}: PayloadParams<SignSolanaMessagePayload>) {
	return sendRequest<SignSolanaMessagePayload>({
		client,
		request: {
			operation: "solana:signMessage",
			...options,
		},
	});
}

const SIGNED_TOKEN_PREFIX = "vt_sat_";
const DEFAULT_SIGNING_CONTEXT = "encryption"; // Default context for HKDF

export interface CreateSignedAccessTokenParams {
	/** The VaultClient instance (used to get the enclave public key). */
	vaultClient: VaultClient;
	/** The base access token string obtained from the createAccessToken API call. */
	baseAccessToken: string;
	/** The specific policies to embed in the signed token's claims. */
	additionalPolicies: PolicyComponent[];
	/** The desired expiration time for the signed token (Unix timestamp in seconds). */
	expiryTimestamp: number;
	/** Optional: The context string for HKDF key derivation. Defaults to "encryption". MUST match server expectation. */
	signingContext?: string;
}

/**
 * Creates a client-side "signed access token".
 * This involves encrypting the baseAccessToken and embedding it, along with
 * additional policies and expiry, into a JWT signed using a key derived
 * from the baseAccessToken itself.
 *
 * NOTE: This function is ASYNCHRONOUS because JWT signing using Web Crypto is async.
 *
 * @param params - The parameters for creating the signed token.
 * @returns A Promise resolving to the signed access token string (prefixed).
 * @throws If any cryptographic operation or JWT signing fails.
 */
export async function createSignedAccessToken({
	vaultClient,
	baseAccessToken,
	additionalPolicies,
	expiryTimestamp,
	signingContext = DEFAULT_SIGNING_CONTEXT,
}: CreateSignedAccessTokenParams): Promise<string> {
	if (!vaultClient || !vaultClient.publicKey) {
		throw new Error("Vault client or enclave public key is missing.");
	}
	if (!baseAccessToken) {
		throw new Error("Base access token is required.");
	}
	if (!additionalPolicies) {
		throw new Error("Additional policies are required.");
	}
	if (typeof expiryTimestamp !== "number" || expiryTimestamp <= 0) {
		throw new Error("Valid expiry timestamp is required.");
	}

	try {
		const enclavePublicKey = vaultClient.publicKey;
		const contextBytes = new TextEncoder().encode(signingContext);

		// 1. Generate client ephemeral keys for this operation
		const clientEphemeralPrivateKey = randomBytes(32);
		const clientEphemeralPublicKey = x25519.getPublicKey(
			clientEphemeralPrivateKey,
		);

		// 2. Derive shared secret (Client Ephemeral Private Key + Enclave Public Key)
		const sharedSecret = x25519.getSharedSecret(
			clientEphemeralPrivateKey,
			enclavePublicKey,
		);

		// 3. Derive encryption key using HKDF
		const encryptionKey = hkdf(
			sha256,
			sharedSecret,
			undefined, // No salt
			contextBytes, // Use the provided or default context
			32, // 32 bytes key length
		);

		// 4. Encrypt the base access token string
		const nonce = randomBytes(24); // 24-byte nonce for XChaCha20
		const cipher = xchacha20poly1305(encryptionKey, nonce);
		const baseTokenBytes = new TextEncoder().encode(baseAccessToken);
		const ciphertext = cipher.encrypt(baseTokenBytes);

		// 5. Prepare JWT Signing Key (SHA-256 hash of the base token)
		const secretBytes = new TextEncoder().encode(baseAccessToken);
		const hashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
		const jwtSigningKey = new Uint8Array(hashBuffer);

		// 6. Prepare JWT Claims
		const claims = {
			encrypted_token: bytesToHex(ciphertext),
			ephemeral_public_key: bytesToHex(clientEphemeralPublicKey),
			// Match Rust SignedTokenClaims struct (ensure names match server expectation)
			exp: expiryTimestamp,
			iat: Math.floor(Date.now() / 1000),
			nonce: bytesToHex(nonce),
			policies: additionalPolicies,
		};

		// 7. Sign the JWT using HS256
		const jwt = await new jose.SignJWT(claims)
			.setProtectedHeader({ alg: "HS256" })
			// .setIssuedAt(claims.iat) // Included in claims
			// .setExpirationTime(claims.exp) // Included in claims
			.sign(jwtSigningKey);

		// 8. Prepend the prefix
		const signedAccessToken = `${SIGNED_TOKEN_PREFIX}${jwt}`;
		return signedAccessToken;
	} catch (error) {
		console.error("Error during signed access token creation:", error);
		throw new Error(
			`Failed to create signed access token: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}
