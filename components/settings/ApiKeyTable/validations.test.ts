/**
 * @jest-environment node
 */

import { ZodError } from "zod";
import { apiKeyValidationSchema } from "./validations";

describe("apiKeyValidationSchema", () => {
  const validApiKey = {
    name: "Api Key Name",
    domains: "example.com",
    bundleIds: "com.example.app",
    redirectUrls: "thirdweb://",
  };

  it("is valid", () => {
    const result = apiKeyValidationSchema.safeParse(validApiKey);
    expect(result.success).toBe(true);
  });

  describe("domains", () => {
    it("is valid with comma separated fqdns", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        domains: "example.com, foo.bar.com, thirdweb.com",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with comma and new-line separated fqdns", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        domains: "example.com\nfoo.bar.com, thirdweb.com",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with port", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        domains: "example.com:3000, foo.bar.com, thirdweb.com:8888",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with localhost", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        domains: "localhost, localhost:3000, thirdweb.com",
      });
      expect(result.success).toBe(true);
    });

    it("is invalid with invalid fqdn", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        domains: "google",
      });
      const zError = (result as any).error as ZodError;

      expect(result.success).toBe(false);
      expect(zError.errors[0].message).toBe("Some of the domains are invalid");
    });
  });

  describe("bundle ids", () => {
    it("is valid with comma separated ids", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        bundleIds: "com.thirdweb.ios, foo.bar.id-123",
      });
      expect(result.success).toBe(true);
    });

    it("is valid with comma and new-line separated fqdns", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        bundleIds: "com.thirdweb.ios, foo.bar.id-123\napp.bundle.id",
      });
      expect(result.success).toBe(true);
    });

    it("is invalid with invalid fqdn", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        bundleIds: "invalid_bundle_id",
      });
      const zError = (result as any).error as ZodError;

      expect(result.success).toBe(false);
      expect(zError.errors[0].message).toBe(
        "Some of the bundle ids are invalid",
      );
    });
  });

  describe("services", () => {
    it("is valid with contract address", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        services: [
          {
            name: "Service 1",
            enabled: true,
            targetAddresses: "0x5a464c28d19848f44199d003bef5ecc87d090f87",
            actions: [],
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("is invalid with invalid address", () => {
      const result = apiKeyValidationSchema.safeParse({
        ...validApiKey,
        services: [
          {
            name: "Service 1",
            enabled: true,
            targetAddresses: "0x123",
            actions: [],
          },
        ],
      });
      const zError = (result as any).error as ZodError;

      expect(result.success).toBe(false);
      expect(zError.errors[0].message).toBe(
        "Some of the addresses are invalid",
      );
    });
  });
});
