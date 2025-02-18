import { describe, expect, it } from "vitest";
import { computeClientIdFromSecretKey } from "../utils/client-id.js";
import { createThirdwebClient } from "./client.js";

describe("client", () => {
  it("should create a client with a clientId", () => {
    const client = createThirdwebClient({ clientId: "foo" });
    expect(client.clientId).toBe("foo");
    expect(client.secretKey).toBeUndefined();
  });
  it("should create a client with a secretKey", () => {
    const client = createThirdwebClient({ secretKey: "bar" });
    expect(client.clientId).toBe(computeClientIdFromSecretKey("bar"));
    expect(client.secretKey).toBe("bar");
  });
  it("should NOT ignore clientId if secretKey is provided", () => {
    const client = createThirdwebClient({ clientId: "foo", secretKey: "bar" });
    expect(client.clientId).toBe("foo");
    expect(client.secretKey).toBe("bar");
  });
  it("should throw an error if neither clientId nor secretKey is provided", () => {
    // @ts-expect-error - testing invalid input
    expect(() => createThirdwebClient({})).toThrowError(
      /clientId or secretKey must be provided/,
    );
  });

  describe("jwt", () => {
    it("should accept a jwt being passed", () => {
      const client = createThirdwebClient({
        clientId: "foo",
        secretKey: "bar.baz.qux",
      });
      expect(client.clientId).toBe("foo");
      expect(client.secretKey).toBe("bar.baz.qux");
    });
    it("should throw if clientId is missing with JWT input", () => {
      expect(() =>
        createThirdwebClient({ secretKey: "bar.baz.qux" }),
      ).toThrowError(/clientId must be provided when using a JWT secretKey/);
    });
  });
});
