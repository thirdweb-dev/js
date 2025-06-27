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
 * Parses an incoming Universal Bridge webhook payload.
 *
 * @param payload - The raw text body received from thirdweb.
 * @param headers - The webhook headers received from thirdweb.
 * @param secret - The webhook secret to verify the payload with.
 * @beta
 * @bridge Webhook
 */
export async function parse(
  /**
   * Raw text body received from thirdweb.
   */
  payload: string,

  /**
   * The webhook headers received from thirdweb.
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
  const timestamp = Number.parseInt(receivedTimestamp, 10);
  const diff = Math.abs(now - timestamp);

  if (diff > tolerance) {
    throw new Error(
      `Webhook timestamp is too old. Difference: ${diff}s, tolerance: ${tolerance}s`,
    );
  }

  // Generate signature using the same method as the sender
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${receivedTimestamp}.${payload}`),
  );

  // Convert the signature to hex string
  const computedSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Compare signatures
  if (computedSignature !== receivedSignature) {
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

  return parsedPayload satisfies WebhookPayload;
}
