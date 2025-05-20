import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { type WebhookPayload, parse } from "./Webhook.js";

const secret = "test-secret";

// Helper function to generate signature
// Accepts any JSON-serialisable body (either the already-stringified payload or
// the raw object) and returns just the computed signature string.
const generateSignature = async (
  timestamp: string,
  body: unknown,
): Promise<string> => {
  const payloadString = typeof body === "string" ? body : JSON.stringify(body);

  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payloadString}`)
    .digest("hex");
};

describe("parseIncomingWebhook", () => {
  const testTimestamp = Math.floor(Date.now() / 1000).toString();
  const validPayload: WebhookPayload = {
    version: 2,
    data: {
      transactionId: "tx123",
      paymentId: "pay123",
      clientId: "client123",
      action: "TRANSFER",
      status: "COMPLETED",
      originToken: "ETH",
      originAmount: "1.0",
      destinationToken: "0x1234567890123456789012345678901234567890",
      destinationAmount: "1.0",
      sender: "0x1234567890123456789012345678901234567890",
      receiver: "0x1234567890123456789012345678901234567890",
      type: "transfer",
      transactions: ["tx1", "tx2"],
      developerFeeBps: 100,
      developerFeeRecipient: "0x1234567890123456789012345678901234567890",
      purchaseData: {},
    },
  };

  it("should successfully verify a valid webhook", async () => {
    const signature = await generateSignature(
      testTimestamp,
      JSON.stringify(validPayload),
    );
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": testTimestamp,
    };

    const result = await parse(JSON.stringify(validPayload), headers, secret);
    expect(result).toEqual(validPayload);
  });

  it("should accept alternative header names", async () => {
    const signature = await generateSignature(
      testTimestamp,
      JSON.stringify(validPayload),
    );
    const headers = {
      "x-pay-signature": signature,
      "x-pay-timestamp": testTimestamp,
    };

    const result = await parse(JSON.stringify(validPayload), headers, secret);
    expect(result).toEqual(validPayload);
  });

  it("should throw error for missing headers", async () => {
    const headers: Record<string, string> = {};
    await expect(
      parse(JSON.stringify(validPayload), headers, secret),
    ).rejects.toThrow(
      "Missing required webhook headers: signature or timestamp",
    );
  });

  it("should throw error for invalid signature", async () => {
    const headers = {
      "x-payload-signature": "invalid-signature",
      "x-timestamp": testTimestamp,
    };

    await expect(
      parse(JSON.stringify(validPayload), headers, secret),
    ).rejects.toThrow("Invalid webhook signature");
  });

  it("should throw error for expired timestamp", async () => {
    const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString(); // 400 seconds old
    const signature = await generateSignature(
      oldTimestamp,
      JSON.stringify(validPayload),
    );
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": oldTimestamp,
    };

    await expect(
      parse(JSON.stringify(validPayload), headers, secret, 300),
    ).rejects.toThrow("Webhook timestamp is too old");
  });

  it("should throw error for invalid JSON payload", async () => {
    const invalidPayload = "invalid-json";
    const signature = await generateSignature(testTimestamp, invalidPayload);
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": testTimestamp,
    };

    await expect(parse(invalidPayload, headers, secret)).rejects.toThrow(
      "Invalid webhook payload: not valid JSON",
    );
  });

  it("should throw error for version 1 payload", async () => {
    const v1Payload = {
      version: 1,
      data: {
        someField: "value",
      },
    };
    const v1PayloadString = JSON.stringify(v1Payload);
    const signature = await generateSignature(testTimestamp, v1PayloadString);
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": testTimestamp,
    };

    await expect(parse(v1PayloadString, headers, secret)).rejects.toThrow(
      "Invalid webhook payload: version 1 is no longer supported, please upgrade to webhook version 2.",
    );
  });

  it("should accept payload within tolerance window", async () => {
    const recentTimestamp = (Math.floor(Date.now() / 1000) - 200).toString(); // 200 seconds old
    const signature = await generateSignature(
      recentTimestamp,
      JSON.stringify(validPayload),
    );
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": recentTimestamp,
    };

    const result = await parse(
      JSON.stringify(validPayload),
      headers,
      secret,
      300,
    );
    expect(result).toEqual(validPayload);
  });

  describe("payload validation", () => {
    it("should throw error for non-object payload", async () => {
      const invalidPayload = JSON.stringify("not-an-object");
      const signature = await generateSignature(testTimestamp, invalidPayload);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(invalidPayload, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: must be an object",
      );
    });

    it("should throw error for missing version", async () => {
      const invalidPayload = {
        data: {
          transactionId: "tx123",
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: version must be a number",
      );
    });

    it("should throw error for missing data object", async () => {
      const invalidPayload = {
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: version 2 must have a data object",
      );
    });

    it("should throw error for missing required fields", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          transactionId: "tx123",
          // Missing other required fields
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: missing required field 'paymentId'",
      );
    });

    it("should throw error for invalid action type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          action: "INVALID_ACTION", // Invalid action type
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: action must be one of: TRANSFER, BUY, SELL",
      );
    });

    it("should throw error for invalid status type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          status: "INVALID_STATUS", // Invalid status type
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: status must be one of: PENDING, FAILED, COMPLETED",
      );
    });

    it("should throw error for invalid hex address", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          destinationToken: "invalid-address", // Invalid hex address
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: destinationToken must be a valid hex address",
      );
    });

    it("should throw error for invalid transactions array", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          transactions: "not-an-array", // Invalid transactions type
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: transactions must be an array",
      );
    });

    it("should throw error for invalid developerFeeBps type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          developerFeeBps: "100", // Invalid type (string instead of number)
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: developerFeeBps must be a number",
      );
    });

    it("should throw error for invalid purchaseData type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          purchaseData: null, // Invalid purchaseData type
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: purchaseData must be an object",
      );
    });

    // Additional tests for full branch coverage

    it("should throw error for invalid transactionId type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          transactionId: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: transactionId must be a string",
      );
    });

    it("should throw error for invalid paymentId type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          paymentId: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: paymentId must be a string",
      );
    });

    it("should throw error for invalid paymentLinkId type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          paymentLinkId: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: paymentLinkId must be a string if it exists",
      );
    });

    it("should throw error for invalid clientId type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          clientId: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: clientId must be a string",
      );
    });

    it("should throw error for invalid originToken type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          originToken: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: originToken must be a string",
      );
    });

    it("should throw error for invalid originAmount type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          originAmount: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: originAmount must be a string",
      );
    });

    it("should throw error for invalid destinationAmount type", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          destinationAmount: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: destinationAmount must be a string",
      );
    });

    it("should throw error for invalid sender address", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          sender: "invalid-address", // not 0x-prefixed
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: sender must be a valid hex address",
      );
    });

    it("should throw error for invalid receiver address", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          receiver: "invalid-address", // not 0x-prefixed
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: receiver must be a valid hex address",
      );
    });

    it("should throw error for invalid type field", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          type: 123, // number instead of string
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: type must be a string",
      );
    });

    it("should throw error for invalid developerFeeRecipient address", async () => {
      const invalidPayload = {
        version: 2,
        data: {
          ...validPayload.data,
          developerFeeRecipient: "invalid-address", // not 0x-prefixed
        },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: developerFeeRecipient must be a valid hex address",
      );
    });

    it("should throw error for version 1 payload missing data object", async () => {
      const invalidPayload = {
        version: 1,
        // no data field
      } as unknown as WebhookPayload;
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(parse(payloadString, headers, secret)).rejects.toThrow(
        "Invalid webhook payload: version 1 must have a data object",
      );
    });
  });

  it("should throw error for unsupported webhook version", async () => {
    const invalidPayload = {
      version: 3,
      data: {},
    };
    const payloadString = JSON.stringify(invalidPayload);
    const signature = await generateSignature(testTimestamp, payloadString);
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": testTimestamp,
    };

    await expect(parse(payloadString, headers, secret)).rejects.toThrow(
      "Invalid webhook payload: unsupported version 3",
    );
  });
});
