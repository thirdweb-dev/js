/**
 * Parses an incoming webhook from thirdweb.
 *
 * @param payload - The raw text body received from thirdweb.
 * @param headers - The webhook headers received from thirdweb.
 * @param secret - The webhook secret to verify the payload with.
 */
export async function parse<T extends Record<string, unknown>>(
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
) {
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
    { name: "HMAC", hash: "SHA-256" },
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
  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payload) as unknown;
  } catch {
    throw new Error("Invalid webhook payload: not valid JSON");
  }

  validateWebhookPayload<T>(parsedPayload);

  // v1 is no longer supported
  if (parsedPayload.version === 1) {
    throw new Error(
      "Invalid webhook payload: version 1 is no longer supported, please upgrade to webhook version 2.",
    );
  }

  return parsedPayload;
}

/**
 * Validates that the payload matches the WebhookPayload type structure.
 * @throws {Error} If the payload is missing required fields or has invalid types
 */
function validateWebhookPayload<T extends Record<string, unknown>>(
  payload: unknown,
): asserts payload is WebhookPayload<T> {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid webhook payload: must be an object");
  }

  const p = payload as Record<string, unknown>;

  if (typeof p.version !== "number") {
    throw new Error("Invalid webhook payload: version must be a number");
  }

  if (p.version === 1) {
    if (!p.data || typeof p.data !== "object") {
      throw new Error(
        "Invalid webhook payload: version 1 must have a data object",
      );
    }
    return;
  }

  if (p.version === 2) {
    if (!p.data || typeof p.data !== "object") {
      throw new Error(
        "Invalid webhook payload: version 2 must have a data object",
      );
    }

    const data = p.data as Record<string, unknown>;
    const requiredFields = [
      "transactionId",
      "paymentId",
      "clientId",
      "action",
      "status",
      "originToken",
      "originAmount",
      "destinationToken",
      "destinationAmount",
      "sender",
      "receiver",
      "type",
      "transactions",
      "developerFeeBps",
      "developerFeeRecipient",
      "purchaseData",
    ] as const;

    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(
          `Invalid webhook payload: missing required field '${field}'`,
        );
      }
    }

    // Type-specific validations
    if (typeof data.transactionId !== "string") {
      throw new Error(
        "Invalid webhook payload: transactionId must be a string",
      );
    }
    if (typeof data.paymentId !== "string") {
      throw new Error("Invalid webhook payload: paymentId must be a string");
    }

    if (data.paymentLinkId && typeof data.paymentLinkId !== "string") {
      throw new Error(
        "Invalid webhook payload: paymentLinkId must be a string if it exists",
      );
    }

    if (typeof data.clientId !== "string") {
      throw new Error("Invalid webhook payload: clientId must be a string");
    }
    if (
      typeof data.action !== "string" ||
      !["TRANSFER", "BUY", "SELL", "ONRAMP"].includes(data.action)
    ) {
      throw new Error(
        "Invalid webhook payload: action must be one of: TRANSFER, BUY, SELL",
      );
    }
    if (
      typeof data.status !== "string" ||
      !["PENDING", "FAILED", "COMPLETED"].includes(data.status)
    ) {
      throw new Error(
        "Invalid webhook payload: status must be one of: PENDING, FAILED, COMPLETED",
      );
    }
    if (typeof data.originToken !== "string") {
      throw new Error("Invalid webhook payload: originToken must be a string");
    }
    if (typeof data.originAmount !== "string") {
      throw new Error("Invalid webhook payload: originAmount must be a string");
    }
    if (
      typeof data.destinationToken !== "string" ||
      !data.destinationToken.startsWith("0x")
    ) {
      throw new Error(
        "Invalid webhook payload: destinationToken must be a valid hex address",
      );
    }
    if (typeof data.destinationAmount !== "string") {
      throw new Error(
        "Invalid webhook payload: destinationAmount must be a string",
      );
    }
    if (typeof data.sender !== "string" || !data.sender.startsWith("0x")) {
      throw new Error(
        "Invalid webhook payload: sender must be a valid hex address",
      );
    }
    if (typeof data.receiver !== "string" || !data.receiver.startsWith("0x")) {
      throw new Error(
        "Invalid webhook payload: receiver must be a valid hex address",
      );
    }
    if (typeof data.type !== "string") {
      throw new Error("Invalid webhook payload: type must be a string");
    }
    if (!Array.isArray(data.transactions)) {
      throw new Error("Invalid webhook payload: transactions must be an array");
    }
    if (typeof data.developerFeeBps !== "number") {
      throw new Error(
        "Invalid webhook payload: developerFeeBps must be a number",
      );
    }
    if (
      typeof data.developerFeeRecipient !== "string" ||
      !data.developerFeeRecipient.startsWith("0x")
    ) {
      throw new Error(
        "Invalid webhook payload: developerFeeRecipient must be a valid hex address",
      );
    }
    if (typeof data.purchaseData !== "object" || data.purchaseData === null) {
      throw new Error(
        "Invalid webhook payload: purchaseData must be an object",
      );
    }
  } else {
    throw new Error(
      `Invalid webhook payload: unsupported version ${p.version}`,
    );
  }
}

export type WebhookPayload<T = Record<string, unknown>> =
  | {
      version: 1;
      data: Record<string, unknown>;
    }
  | {
      version: 2;
      data: {
        transactionId: string;
        paymentId: string;
        // only exists when the payment was triggered from a developer specified payment link
        paymentLinkId?: string | undefined;
        clientId: string;
        action: "TRANSFER" | "BUY" | "SELL";
        status: "PENDING" | "FAILED" | "COMPLETED";
        originToken: string;
        originAmount: string;
        destinationToken: `0x${string}`;
        destinationAmount: string;
        sender: `0x${string}`;
        receiver: `0x${string}`;
        type: string;
        transactions: string[];
        developerFeeBps: number;
        developerFeeRecipient: `0x${string}`;
        purchaseData: T;
      };
    };
