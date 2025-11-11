import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { parse, type WebhookPayload } from "./Webhook.js";

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
  const validWebhook: WebhookPayload = {
    data: {
      action: "TRANSFER",
      clientId: "client123",
      destinationAmount: 10n,
      destinationToken: {
        address: "0x1234567890123456789012345678901234567890" as const,
        chainId: 1,
        decimals: 18,
        iconUri: "https://example.com/icon.png",
        name: "Token",
        priceUsd: 1.0,
        symbol: "TKN",
      },
      developerFeeBps: 100,
      developerFeeRecipient: "0x1234567890123456789012345678901234567890",
      originAmount: 10n,
      originToken: {
        address: "0x1234567890123456789012345678901234567890" as const,
        chainId: 1,
        decimals: 18,
        iconUri: "https://example.com/icon.png",
        name: "Token",
        priceUsd: 1.0,
        symbol: "TKN",
      },
      paymentId: "pay123",
      purchaseData: {},
      receiver: "0x1234567890123456789012345678901234567890",
      sender: "0x1234567890123456789012345678901234567890",
      status: "COMPLETED",
      transactions: [
        {
          chainId: 1,
          transactionHash: "0x1234567890123456789012345678901234567890",
        },
        {
          chainId: 1,
          transactionHash: "0x1234567890123456789012345678901234567890",
        },
      ],
      type: "transfer",
    },
    type: "pay.onchain-transaction",
    version: 2,
  };
  const validPayload = {
    ...validWebhook,
    data: {
      ...validWebhook.data,
      destinationAmount: validWebhook.data.destinationAmount.toString(),
      originAmount: validWebhook.data.originAmount.toString(),
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
    expect(result).toEqual(validWebhook);
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
    expect(result).toEqual(validWebhook);
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
    ).rejects.toThrow(/Webhook timestamp is too old/);
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
      data: {
        someField: "value",
      },
      type: "pay.onchain-transaction",
      version: 1,
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
    expect(result).toEqual(validWebhook);
  });

  describe("payload validation", () => {
    it("should throw error for non-object payload", async () => {
      const invalidPayload = JSON.stringify("not-an-object");
      const signature = await generateSignature(testTimestamp, invalidPayload);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(invalidPayload, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
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

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
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

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for missing required fields", async () => {
      const invalidPayload = {
        data: {
          transactionId: "tx123",
          // Missing other required fields
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid action type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          action: "INVALID_ACTION", // Invalid action type
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid status type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          status: "INVALID_STATUS", // Invalid status type
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid hex address", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          destinationToken: "invalid-address", // Invalid hex address
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid transactions array", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          transactions: "not-an-array", // Invalid transactions type
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid developerFeeBps type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          developerFeeBps: "not-a-number", // Invalid value (cannot coerce to number)
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid purchaseData type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          purchaseData: null, // Invalid purchaseData type
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    // Additional tests for full branch coverage

    it("should throw error for invalid paymentId type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          paymentId: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid paymentLinkId type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          paymentLinkId: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid clientId type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          clientId: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid originToken type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          originToken: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid originAmount type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          originAmount: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid destinationAmount type", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          destinationAmount: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid sender address", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          sender: "invalid-address", // not 0x-prefixed
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid receiver address", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          receiver: "invalid-address", // not 0x-prefixed
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid type field", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          type: 123, // number instead of string
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for invalid developerFeeRecipient address", async () => {
      const invalidPayload = {
        data: {
          ...validPayload.data,
          developerFeeRecipient: "invalid-address", // not 0x-prefixed
        },
        version: 2,
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });

    it("should throw error for version 1 payload missing data object", async () => {
      const invalidPayload = {
        type: "pay.onchain-transaction",
        version: 1,
        // no data field
      } as unknown as WebhookPayload;
      const payloadString = JSON.stringify(invalidPayload);
      const signature = await generateSignature(testTimestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": testTimestamp,
      };

      await expect(
        parse(payloadString, headers, secret),
      ).rejects.toHaveProperty("name", "$ZodError");
    });
  });

  it("should throw error for unsupported webhook version", async () => {
    const invalidPayload = {
      data: {},
      version: 3,
    };
    const payloadString = JSON.stringify(invalidPayload);
    const signature = await generateSignature(testTimestamp, payloadString);
    const headers = {
      "x-payload-signature": signature,
      "x-timestamp": testTimestamp,
    };

    await expect(parse(payloadString, headers, secret)).rejects.toHaveProperty(
      "name",
      "$ZodError",
    );
  });

  describe("verify", () => {
    type VerifyOptions = Parameters<typeof parse>[4];

    async function stringifyAndParse(
      payload: unknown,
      verify?: VerifyOptions,
    ): Promise<WebhookPayload> {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payloadString =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      const signature = await generateSignature(timestamp, payloadString);
      const headers = {
        "x-payload-signature": signature,
        "x-timestamp": timestamp,
      };
      return parse(payloadString, headers, secret, 300, verify);
    }

    async function expectVerifyFailure(
      payload: unknown,
      verify: VerifyOptions,
      message: string,
    ): Promise<void> {
      await expect(stringifyAndParse(payload, verify)).rejects.toThrow(message);
    }

    describe("onchain tx", () => {
      it("should pass when all verification values match", async () => {
        const result = await stringifyAndParse(validPayload, {
          receiverAddress: validWebhook.data.receiver,
          destinationTokenAddress: validWebhook.data.destinationToken.address,
          destinationChainId: validWebhook.data.destinationToken.chainId,
          minDestinationAmount: validWebhook.data.destinationAmount,
        });
        expect(result).toEqual(validWebhook);
      });

      it("should fail if receiverAddress does not match", async () => {
        const expected = "0x0000000000000000000000000000000000000000";
        await expectVerifyFailure(
          validPayload,
          { receiverAddress: expected },
          `Verification Failed: receiverAddress mismatch, Expected: ${expected}, Received: ${validWebhook.data.receiver}`,
        );
      });

      it("should fail if destinationTokenAddress does not match", async () => {
        const expected = "0x0000000000000000000000000000000000000001";
        await expectVerifyFailure(
          validPayload,
          { destinationTokenAddress: expected },
          `Verification Failed: destinationTokenAddress mismatch, Expected: ${expected}, Received: ${validWebhook.data.destinationToken.address}`,
        );
      });

      it("should fail if destinationChainId does not match", async () => {
        const expected = 137;
        await expectVerifyFailure(
          validPayload,
          { destinationChainId: expected },
          `Verification Failed: destinationChainId mismatch, Expected: ${expected}, Received: ${validWebhook.data.destinationToken.chainId}`,
        );
      });

      it("should fail if minDestinationAmount is greater than actual", async () => {
        const expectedMin = validWebhook.data.destinationAmount + 1n;
        await expectVerifyFailure(
          validPayload,
          { minDestinationAmount: expectedMin },
          `Verification Failed: minDestinationAmount, Expected minimum amount to be ${expectedMin}, Received: ${validWebhook.data.destinationAmount}`,
        );
      });
    });

    describe("onramp tx", () => {
      const onrampWebhook: WebhookPayload = {
        data: {
          amount: 100n,
          currency: "USD",
          currencyAmount: 100,
          id: "onramp123",
          onramp: "moonpay",
          paymentLinkId: "plink_123",
          purchaseData: {},
          receiver: "0x1234567890123456789012345678901234567890",
          sender: "0x1234567890123456789012345678901234567890",
          status: "COMPLETED",
          token: {
            address: "0x1234567890123456789012345678901234567890",
            chainId: 1,
            decimals: 18,
            iconUri: "https://example.com/icon.png",
            name: "Token",
            priceUsd: 1.0,
            symbol: "TKN",
          },
          transactionHash: "0x1234567890123456789012345678901234567890",
        },
        type: "pay.onramp-transaction",
        version: 2,
      };
      const onrampPayload = {
        ...onrampWebhook,
        data: {
          ...onrampWebhook.data,
          amount: onrampWebhook.data.amount.toString(),
        },
      };

      it("should pass when all verification values match ", async () => {
        const result = await stringifyAndParse(onrampPayload, {
          receiverAddress: onrampWebhook.data.receiver,
          destinationTokenAddress: onrampWebhook.data.token.address,
          destinationChainId: onrampWebhook.data.token.chainId,
          minDestinationAmount: onrampWebhook.data.amount,
        });
        expect(result).toEqual(onrampWebhook);
      });

      it("should fail if destinationTokenAddress does not match ", async () => {
        const expected = "0x0000000000000000000000000000000000000002";
        await expectVerifyFailure(
          onrampPayload,
          { destinationTokenAddress: expected },
          `Verification Failed: destinationTokenAddress mismatch, Expected: ${expected}, Received: ${onrampWebhook.data.token.address}`,
        );
      });

      it("should fail if destinationChainId does not match ", async () => {
        const expected = 8453;
        await expectVerifyFailure(
          onrampPayload,
          { destinationChainId: expected },
          `Verification Failed: destinationChainId mismatch, Expected: ${expected}, Received: ${onrampWebhook.data.token.chainId}`,
        );
      });

      it("should fail if minDestinationAmount is greater than actual ", async () => {
        const expectedMin = onrampWebhook.data.amount + 1n;
        await expectVerifyFailure(
          onrampPayload,
          { minDestinationAmount: expectedMin },
          `Verification Failed: minDestinationAmount, Expected minimum amount to be ${expectedMin}, Received: ${onrampWebhook.data.amount}`,
        );
      });

      it("should fail if receiverAddress does not match", async () => {
        const expected = "0x0000000000000000000000000000000000000003";
        await expectVerifyFailure(
          onrampPayload,
          { receiverAddress: expected },
          `Verification Failed: receiverAddress mismatch, Expected: ${expected}, Received: ${onrampWebhook.data.receiver}`,
        );
      });
    });
  });
});
