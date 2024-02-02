import { describe, it, expect } from "vitest";
import { createClient } from "./client.js";
import { computeClientIdFromSecretKey } from "../utils/client-id.js";

describe("client", () => {
  it("should create a client with a clientId", () => {
    const client = createClient({ clientId: "foo" });
    expect(client.clientId).toBe("foo");
    expect(client.secretKey).toBeUndefined();
  });
  it("should create a client with a secretKey", () => {
    const client = createClient({ secretKey: "bar" });
    expect(client.clientId).toBe(computeClientIdFromSecretKey("bar"));
    expect(client.secretKey).toBe("bar");
  });
  it("should ignore clientId if secretKey is provided", () => {
    // @ts-expect-error - testing invalid input
    const client = createClient({ clientId: "foo", secretKey: "bar" });
    expect(client.clientId).toBe(computeClientIdFromSecretKey("bar"));
    expect(client.secretKey).toBe("bar");
  });
  it("should throw an error if neither clientId nor secretKey is provided", () => {
    // @ts-expect-error - testing invalid input
    expect(() => createClient({})).toThrowError(
      "clientId or secretKey must be provided",
    );
  });
});
