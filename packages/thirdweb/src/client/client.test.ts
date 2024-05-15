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
  it("should ignore clientId if secretKey is provided", () => {
    // @ts-expect-error - testing invalid input
    const client = createThirdwebClient({ clientId: "foo", secretKey: "bar" });
    expect(client.clientId).toBe(computeClientIdFromSecretKey("bar"));
    expect(client.secretKey).toBe("bar");
  });
  it("should throw an error if neither clientId nor secretKey is provided", () => {
    // @ts-expect-error - testing invalid input
    expect(() => createThirdwebClient({})).toThrowError(
      "clientId or secretKey must be provided",
    );
  });
});
