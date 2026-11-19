import { z } from "zod/v4-mini";
import { isAddress } from "../utils/address.js";
import { isHex } from "../utils/encoding/hex.js";

const hexSchema = z
  .string()
  .check(z.refine(isHex, { message: "Invalid hex string" }));
const addressSchema = z
  .string()
  .check(z.refine(isAddress, { message: "Invalid address" }));
const tokenSchema = z.object({
  address: addressSchema,
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  iconUri: z.optional(z.string()),
  name: z.string(),
  priceUsd: z.coerce.number(),
  symbol: z.string(),
});

const onchainWebhookSchema = z.discriminatedUnion("version", [
  z.object({
    data: z.object({}),
    type: z.literal("pay.onchain-transaction"),
    version: z.literal(1),
  }),
  z.object({
    data: z.object({
      action: z.enum(["TRANSFER", "BUY", "SELL"]),
      clientId: z.string(),
      destinationAmount: z.coerce.bigint(),
      destinationToken: tokenSchema,
      developerFeeBps: z.coerce.number(),
      developerFeeRecipient: addressSchema,
      originAmount: z.coerce.bigint(),
      originToken: tokenSchema,
      paymentId: z.string(),
      // only exists when the payment was triggered from a developer specified payment link
      paymentLinkId: z.optional(z.string()),
      purchaseData: z.optional(z.record(z.string(), z.unknown())),
      receiver: addressSchema,
      sender: addressSchema,
      status: z.enum(["PENDING", "FAILED", "COMPLETED"]),
      transactions: z.array(
        z.object({
          chainId: z.coerce.number(),
          transactionHash: hexSchema,
        }),
      ),
      type: z.string(),
    }),
    type: z.literal("pay.onchain-transaction"),
    version: z.literal(2),
  }),
]);

const onrampWebhookSchema = z.discriminatedUnion("version", [
  z.object({
    data: z.object({}),
    type: z.literal("pay.onramp-transaction"),
    version: z.literal(1),
  }),
  z.object({
    data: z.object({
      amount: z.coerce.bigint(),
      currency: z.string(),
      currencyAmount: z.number(),
      id: z.string(),
      onramp: z.string(),
      paymentLinkId: z.optional(z.string()),
      purchaseData: z.unknown(),
      receiver: addressSchema,
      sender: z.optional(addressSchema),
      status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
      token: tokenSchema,
      transactionHash: z.optional(hexSchema),
    }),
    type: z.literal("pay.onramp-transaction"),
    version: z.literal(2),
  }),
]);

const webhookSchema = z.discriminatedUnion("type", [
  onchainWebhookSchema,
  onrampWebhookSchema,
]);
export type WebhookPayload = Exclude<
  z.infer<typeof webhookSchema>,
  { version: 1 }
>;

/**
 * Parses an incoming Bridge webhook payload.
 *
 * @param payload - The raw text body received from thirdweb.
 * @param headers - The webhook headers received from thirdweb.
 * @param secret - The webhook secret to verify the payload with.
 * @bridge Webhook
 * @beta
 */
export async function parse(
  /**
   * Raw text body received from thirdweb.
   */
  payload: string,

  /**
   * The webhook headers received from thirdweb. The timestamp must contain
   * decimal Unix seconds and the HMAC signature must be lowercase hex.
   */
  headers: Record<string, string>,

  /**
   * The webhook secret to verify the payload with.
   */
  secret: string,

  /**
   * The tolerance in seconds for the timestamp verification.
   */
  tolerance = 300, // Default to 5 minutes if not specified

  /**
   * Add various validations to the parsed payload to ensure it matches the expected values. Throws error if any validation fails.
   */
  verify?: {
    /**
     * Verify that the payload's the destination token amount (in wei) is greater than `minDestinationAmount` value
     */
    minDestinationAmount?: bigint;
    /**
     * Verify that the payload's destination token address is the same as `destinationTokenAddress` value
     */
    destinationTokenAddress?: string;
    /**
     * Verify that the payload's destination chain id is the same as `destinationChainId` value
     */
    destinationChainId?: number;
    /**
     * Verify that the payload's receiver address is the same as `receiverAddress` value.
     */
    receiverAddress?: string;
  },
): Promise<WebhookPayload> {
  // Get the signature and timestamp from headers
  const receivedSignature =
    headers["x-payload-signature"] || headers["x-pay-signature"];
  const receivedTimestamp =
    headers["x-timestamp"] || headers["x-pay-timestamp"];

  if (!receivedSignature || !receivedTimestamp) {
    throw new Error("Missing required webhook headers: signature or timestamp");
  }

  // Verify timestamp
  const now = Math.floor(Date.now() / 1000);
  const timestamp = Number(receivedTimestamp);
  if (/[^0-9]/.test(receivedTimestamp) || !Number.isSafeInteger(timestamp)) {
    throw new Error("Invalid webhook timestamp");
  }
  const diff = Math.abs(now - timestamp);

  if (diff > tolerance) {
    throw new Error(
      `Webhook timestamp is too old. Difference: ${diff}s, tolerance: ${tolerance}s`,
    );
  }

  if (receivedSignature.length !== 64 || /[^0-9a-f]/.test(receivedSignature)) {
    throw new Error("Invalid webhook signature");
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["verify"],
  );

  const signature = new Uint8Array(32);
  for (let i = 0; i < signature.length; i++) {
    signature[i] = Number.parseInt(
      receivedSignature.slice(i * 2, i * 2 + 2),
      16,
    );
  }

  const validSignature = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(`${receivedTimestamp}.${payload}`),
  );

  if (!validSignature) {
    throw new Error("Invalid webhook signature");
  }

  // Parse the payload as JSON
  let payloadObject: unknown;
  try {
    payloadObject = JSON.parse(payload) as unknown;
  } catch {
    throw new Error("Invalid webhook payload: not valid JSON");
  }

  const parsedPayload = webhookSchema.parse(payloadObject);

  // v1 is no longer supported
  if (parsedPayload.version === 1) {
    throw new Error(
      "Invalid webhook payload: version 1 is no longer supported, please upgrade to webhook version 2.",
    );
  }

  if (verify) {
    // verify receiver address
    if (verify.receiverAddress) {
      if (
        parsedPayload.data.receiver.toLowerCase() !==
        verify.receiverAddress.toLowerCase()
      ) {
        throw new Error(
          `Verification Failed: receiverAddress mismatch, Expected: ${verify.receiverAddress}, Received: ${parsedPayload.data.receiver}`,
        );
      }
    }

    // verify destination token address
    if (verify.destinationTokenAddress) {
      // onchain transaction
      if ("destinationToken" in parsedPayload.data) {
        if (
          parsedPayload.data.destinationToken.address.toLowerCase() !==
          verify.destinationTokenAddress.toLowerCase()
        ) {
          throw new Error(
            `Verification Failed: destinationTokenAddress mismatch, Expected: ${verify.destinationTokenAddress}, Received: ${parsedPayload.data.destinationToken.address}`,
          );
        }
      }
      // onramp transaction
      else if ("onramp" in parsedPayload.data) {
        if (
          parsedPayload.data.token.address.toLowerCase() !==
          verify.destinationTokenAddress.toLowerCase()
        ) {
          throw new Error(
            `Verification Failed: destinationTokenAddress mismatch, Expected: ${verify.destinationTokenAddress}, Received: ${parsedPayload.data.token.address}`,
          );
        }
      }
    }

    // verify destination chain id
    if (verify.destinationChainId) {
      // onchain tx
      if ("destinationToken" in parsedPayload.data) {
        if (
          parsedPayload.data.destinationToken.chainId !==
          verify.destinationChainId
        ) {
          throw new Error(
            `Verification Failed: destinationChainId mismatch, Expected: ${verify.destinationChainId}, Received: ${parsedPayload.data.destinationToken.chainId}`,
          );
        }
      }
      // onramp tx
      else if ("onramp" in parsedPayload.data) {
        if (parsedPayload.data.token.chainId !== verify.destinationChainId) {
          throw new Error(
            `Verification Failed: destinationChainId mismatch, Expected: ${verify.destinationChainId}, Received: ${parsedPayload.data.token.chainId}`,
          );
        }
      }
    }

    // verify amount
    if (verify.minDestinationAmount) {
      // onchain tx
      if ("destinationAmount" in parsedPayload.data) {
        if (
          parsedPayload.data.destinationAmount < verify.minDestinationAmount
        ) {
          throw new Error(
            `Verification Failed: minDestinationAmount, Expected minimum amount to be ${verify.minDestinationAmount}, Received: ${parsedPayload.data.destinationAmount}`,
          );
        }
      }
      // onramp tx
      else if ("onramp" in parsedPayload.data) {
        if (parsedPayload.data.amount < verify.minDestinationAmount) {
          throw new Error(
            `Verification Failed: minDestinationAmount, Expected minimum amount to be ${verify.minDestinationAmount}, Received: ${parsedPayload.data.amount}`,
          );
        }
      }
    }
  }

  return parsedPayload satisfies WebhookPayload;
}
