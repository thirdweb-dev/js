/**
 * Header used for JWT token specifying hash algorithm
 */
export const RAW_HEADER = {
  // Specify ECDSA with SHA-256 for hashing algorithm
  alg: "ES256",
  typ: "JWT",
};

/**
 * This is a precompile of the header for the JWT generated via:
 * ```ts
 * uint8ArrayToBase64(
 * stringToBytes(JSON.stringify(RAW_HEADER)),
 * )
 * ```
 */
export const PRECOMPILED_B64_ENCODED_JWT_HEADER =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9";
