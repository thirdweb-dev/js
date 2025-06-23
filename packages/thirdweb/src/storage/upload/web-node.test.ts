import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { handlers as storageHandlers } from "../../../test/src/mocks/storage.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getThirdwebDomains } from "../../utils/domains.js";
import { uploadBatch } from "./web-node.js";

const server = setupServer(...storageHandlers);

// skip this test for now, will need to be manually run
describe.skip("uploadBatch", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  const mockClient: ThirdwebClient = {
    clientId: "test-client-id",
    secretKey: "test-secret-key",
  };

  it("should upload files successfully", async () => {
    const form = new FormData();
    form.append("file1", new Blob(["test content"]), "file1.txt");
    form.append("file2", new Blob(["another test"]), "file2.txt");

    const result = await uploadBatch(mockClient, form, [
      "file1.txt",
      "file2.txt",
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe("ipfs://QmTest1234567890TestHash/file1.txt");
    expect(result[1]).toBe("ipfs://QmTest1234567890TestHash/file2.txt");
  });

  it("should throw an error for unauthorized access", async () => {
    server.use(
      http.post(
        `https://${getThirdwebDomains().storage}/ipfs/upload`,
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    const form = new FormData();
    form.append("file", new Blob(["test"]), "file.txt");

    await expect(uploadBatch(mockClient, form, ["file.txt"])).rejects.toThrow(
      "Unauthorized - You don't have permission to use this service.",
    );
  });

  it("should throw an error for storage limit reached", async () => {
    server.use(
      http.post(
        `https://${getThirdwebDomains().storage}/ipfs/upload`,
        () => new HttpResponse(null, { status: 402 }),
      ),
    );

    const form = new FormData();
    form.append("file", new Blob(["test"]), "file.txt");

    await expect(uploadBatch(mockClient, form, ["file.txt"])).rejects.toThrow(
      "You have reached your storage limit. Please add a valid payment method to continue using the service.",
    );
  });

  it("should throw an error for forbidden access", async () => {
    server.use(
      http.post(
        `https://${getThirdwebDomains().storage}/ipfs/upload`,
        () => new HttpResponse(null, { status: 403 }),
      ),
    );

    const form = new FormData();
    form.append("file", new Blob(["test"]), "file.txt");

    await expect(uploadBatch(mockClient, form, ["file.txt"])).rejects.toThrow(
      "Forbidden - You don't have permission to use this service.",
    );
  });

  it("should throw an error for other HTTP errors", async () => {
    server.use(
      http.post(
        `https://${getThirdwebDomains().storage}/ipfs/upload`,
        () =>
          new HttpResponse(null, {
            status: 500,
            statusText: "Internal Server Error",
          }),
      ),
    );

    const form = new FormData();
    form.append("file", new Blob(["test"]), "file.txt");

    await expect(uploadBatch(mockClient, form, ["file.txt"])).rejects.toThrow(
      "Failed to upload files to IPFS - 500 - Internal Server Error",
    );
  });

  it("should throw an error for missing CID", async () => {
    server.use(
      http.post(`https://${getThirdwebDomains().storage}/ipfs/upload`, () =>
        HttpResponse.json({}),
      ),
    );

    const form = new FormData();
    form.append("file", new Blob(["test"]), "file.txt");

    await expect(uploadBatch(mockClient, form, ["file.txt"])).rejects.toThrow(
      "Failed to upload files to IPFS - Bad CID",
    );
  });
});
