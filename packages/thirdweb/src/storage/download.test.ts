import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { handlers as storageHandlers } from "../../test/src/mocks/storage.js";
import type { ThirdwebClient } from "../client/client.js";
import { download } from "./download.js";

const server = setupServer(...storageHandlers);

describe.skip("download", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  const mockClient: ThirdwebClient = {
    clientId: "test-client-id",
    secretKey: "test-secret-key",
  };

  it("should download IPFS file successfully", async () => {
    const mockContent = "Test IPFS content";
    server.use(
      http.get("https://*.ipfscdn.io/ipfs/:hash/:id", () => {
        return new HttpResponse(mockContent, {
          headers: { "Content-Type": "text/plain" },
          status: 200,
        });
      }),
    );

    const result = await download({
      client: mockClient,
      uri: "ipfs://QmTest1234567890TestHash/file.txt",
    });

    expect(result.ok).toBe(true);
    expect(await result.text()).toBe(mockContent);
  });

  it("should download Arweave file successfully", async () => {
    const mockContent = "Test Arweave content";
    server.use(
      http.get("https://arweave.net/:id", () => {
        return new HttpResponse(mockContent, {
          headers: { "Content-Type": "text/plain" },
          status: 200,
        });
      }),
    );

    const result = await download({
      client: mockClient,
      uri: "ar://TestArweaveTransactionId",
    });

    expect(result.ok).toBe(true);
    expect(await result.text()).toBe(mockContent);
  });

  it("should download HTTP file successfully", async () => {
    const mockContent = "Test HTTP content";
    server.use(
      http.get("https://example.com/file.txt", () => {
        return new HttpResponse(mockContent, {
          headers: { "Content-Type": "text/plain" },
          status: 200,
        });
      }),
    );

    const result = await download({
      client: mockClient,
      uri: "https://example.com/file.txt",
    });

    expect(result.ok).toBe(true);
    expect(await result.text()).toBe(mockContent);
  });

  it("should throw an error for failed downloads", async () => {
    server.use(
      http.get("https://*.ipfscdn.io/ipfs/:hash/:id", () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    await expect(
      download({
        client: mockClient,
        uri: "ipfs://QmTest1234567890TestHash/nonexistent.txt",
      }),
    ).rejects.toThrow("Failed to download file: Not Found");
  });

  it("should respect custom timeout", async () => {
    server.use(
      http.get("https://*.ipfscdn.io/ipfs/:hash/:id", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return new HttpResponse("Delayed response", { status: 200 });
      }),
    );

    await expect(
      download({
        client: mockClient,
        requestTimeoutMs: 500,
        uri: "ipfs://QmTest1234567890TestHash/file.txt",
      }),
    ).rejects.toThrow("timeout");
  });

  it("should respect custom client timeout", async () => {
    server.use(
      http.get("https://*.ipfscdn.io/ipfs/:hash/:id", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return new HttpResponse("Delayed response", { status: 200 });
      }),
    );

    await expect(
      download({
        client: {
          ...mockClient,
          config: { storage: { fetch: { requestTimeoutMs: 500 } } },
        },
        uri: "ipfs://QmTest1234567890TestHash/file.txt",
      }),
    ).rejects.toThrow("timeout");
  });
});
