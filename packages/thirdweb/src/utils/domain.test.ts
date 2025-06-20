import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_RPC_URL,
  getThirdwebBaseUrl,
  getThirdwebDomains,
  setThirdwebDomains,
} from "./domains.js";

describe("Thirdweb Domains", () => {
  const defaultDomains = {
    analytics: "c.thirdweb.com",
    bridge: "bridge.thirdweb.com",
    bundler: "bundler.thirdweb.com",
    engineCloud: "engine.thirdweb.com",
    inAppWallet: "embedded-wallet.thirdweb.com",
    insight: "insight.thirdweb.com",
    pay: "pay.thirdweb.com",
    rpc: "rpc.thirdweb.com",
    social: "social.thirdweb.com",
    storage: "storage.thirdweb.com",
  };

  beforeEach(() => {
    // Reset to default domains before each test
    setThirdwebDomains({});
  });

  describe("getThirdwebDomains", () => {
    it("should return the default domains if no overrides are set", () => {
      expect(getThirdwebDomains()).toEqual(defaultDomains);
    });
  });

  describe("setThirdwebDomains", () => {
    it("should override specific domains while keeping others as default", () => {
      setThirdwebDomains({
        analytics: "custom.analytics.com",
        rpc: "custom.rpc.com",
      });

      expect(getThirdwebDomains()).toEqual({
        ...defaultDomains,
        analytics: "custom.analytics.com",
        rpc: "custom.rpc.com",
      });
    });

    it("should not modify domains that are not overridden", () => {
      setThirdwebDomains({ pay: "custom.pay.com" });

      const domains = getThirdwebDomains();
      expect(domains.pay).toBe("custom.pay.com");
      expect(domains.rpc).toBe(defaultDomains.rpc);
      expect(domains.analytics).toBe(defaultDomains.analytics);
    });
  });

  describe("getThirdwebBaseUrl", () => {
    it("should return an HTTPS URL for non-localhost domains", () => {
      const baseUrl = getThirdwebBaseUrl("rpc");
      expect(baseUrl).toBe(`https://${DEFAULT_RPC_URL}`);
    });

    it("should return an HTTP URL for localhost domains", () => {
      setThirdwebDomains({ rpc: "localhost:8545" });
      const baseUrl = getThirdwebBaseUrl("rpc");
      expect(baseUrl).toBe("http://localhost:8545");
    });

    it("should reflect the updated domain overrides", () => {
      setThirdwebDomains({ storage: "custom.storage.com" });
      const baseUrl = getThirdwebBaseUrl("storage");
      expect(baseUrl).toBe("https://custom.storage.com");
    });

    it("should throw an error if an invalid service is requested", () => {
      // biome-ignore lint/suspicious/noExplicitAny: for test
      expect(() => getThirdwebBaseUrl("invalid" as any)).toThrow();
    });
  });
});
