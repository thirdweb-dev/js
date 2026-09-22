import { describe, expect, it } from "vitest";
import {
  normalizePaymentRequirements,
  parsePaymentRequirementsForDisplay,
} from "./schemas.js";

const PAY_TO = "0x1234567890123456789012345678901234567890";
const ASSET = "0x0000000000000000000000000000000000000001";
const REQUEST_URL = "https://api.example.com/paid";

const canonicalV2Requirement = {
  scheme: "exact",
  network: "eip155:8453",
  amount: "1000",
  payTo: PAY_TO,
  maxTimeoutSeconds: 300,
  asset: ASSET,
  extra: { name: "Test Token", version: "1" },
};

describe("normalizePaymentRequirements", () => {
  it("canonicalises the amount", () => {
    const { requirements } = normalizePaymentRequirements(
      { ...canonicalV2Requirement, amount: "0100" },
      { resourceUrl: REQUEST_URL },
    );
    expect(requirements.maxAmountRequired).toBe("100");
  });

  it("accepts amount and maxAmountRequired with the same value", () => {
    const { requirements } = normalizePaymentRequirements(
      { ...canonicalV2Requirement, amount: "0100", maxAmountRequired: "100" },
      { resourceUrl: REQUEST_URL },
    );
    expect(requirements.maxAmountRequired).toBe("100");
  });

  it.each([
    { amount: "1", maxAmountRequired: "1000000000" },
    { amount: "1000000000", maxAmountRequired: "1" },
  ])("rejects mismatched amounts (%j)", (amounts) => {
    expect(() =>
      normalizePaymentRequirements(
        { ...canonicalV2Requirement, ...amounts },
        { resourceUrl: REQUEST_URL },
      ),
    ).toThrow("do not match");
  });

  it("keeps the raw requirement", () => {
    const raw = { ...canonicalV2Requirement };
    expect(
      normalizePaymentRequirements(raw, { resourceUrl: REQUEST_URL }).raw,
    ).toBe(raw);
  });
});

describe("parsePaymentRequirementsForDisplay", () => {
  it("parses a canonical v2 requirement without a resource using the request URL", () => {
    expect(
      parsePaymentRequirementsForDisplay(
        { x402Version: 2, accepts: [canonicalV2Requirement] },
        REQUEST_URL,
      ),
    ).toEqual([
      expect.objectContaining({
        network: "eip155:8453",
        asset: ASSET,
        maxAmountRequired: "1000",
        resource: REQUEST_URL,
      }),
    ]);
  });

  it("prefers the top-level resource URL", () => {
    expect(
      parsePaymentRequirementsForDisplay(
        {
          x402Version: 2,
          resource: { url: "https://api.example.com/resource" },
          accepts: [canonicalV2Requirement],
        },
        REQUEST_URL,
      ),
    ).toEqual([
      expect.objectContaining({ resource: "https://api.example.com/resource" }),
    ]);
  });

  it("skips invalid entries", () => {
    const requirements = parsePaymentRequirementsForDisplay(
      {
        x402Version: 2,
        accepts: [
          { ...canonicalV2Requirement, amount: "1", maxAmountRequired: "2" },
          { ...canonicalV2Requirement, amount: "1e3" },
          { ...canonicalV2Requirement, network: "eip155:1" },
        ],
      },
      REQUEST_URL,
    );
    expect(requirements).toHaveLength(1);
    expect(requirements[0]?.network).toBe("eip155:1");
  });

  it.each([[undefined], [null], [{}], [{ accepts: "invalid" }]])(
    "returns no requirements for %j",
    (paymentRequired) => {
      expect(
        parsePaymentRequirementsForDisplay(paymentRequired, REQUEST_URL),
      ).toEqual([]);
    },
  );

  it("returns no requirements when no resource URL can be resolved", () => {
    expect(
      parsePaymentRequirementsForDisplay({
        x402Version: 2,
        accepts: [canonicalV2Requirement],
      }),
    ).toEqual([]);
  });
});
