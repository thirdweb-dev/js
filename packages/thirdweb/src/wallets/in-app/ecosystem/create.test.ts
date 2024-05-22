import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { createWalletEcosystem } from "./create.js";

const handlers = [
  http.post(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider`,
    () => {
      return HttpResponse.json({
        name: "My Connect Ecosystem",
        imageUrl: "https://example.com/ecosystem-image.png",
        id: "58753ea3-8312-41d6-b605-8549488bb9ab",
        createdAt: "2024-05-22T17:38:59.568133+00:00",
        updatedAt: "2024-05-22T17:38:59.568133+00:00",
      });
    },
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe.sequential("createWalletEcosystem", () => {
  it("should throw an error if secret key is missing", async () => {
    const client = { secretKey: "" } as ThirdwebClient;
    const options = {
      client,
      name: "Test Ecosystem",
      logoUrl: "http://example.com/logo.png",
    };

    await expect(createWalletEcosystem(options)).rejects.toThrow(
      "Unauthorized - Secret Key is required to create a wallet ecosystem.",
    );
  });

  it("should create a wallet ecosystem successfully", async () => {
    const client = { secretKey: "valid_secret_key" } as ThirdwebClient;
    const options = {
      client,
      name: "Test Ecosystem",
      logoUrl: "http://example.com/logo.png",
    };

    const result = await createWalletEcosystem(options);
    expect(result).toBe("58753ea3-8312-41d6-b605-8549488bb9ab");
  });

  it("should handle API errors", async () => {
    server.use(
      http.post(
        `https://${
          getThirdwebDomains().inAppWallet
        }/api/2024-05-05/ecosystem-wallet/provider`,
        () => {
          return HttpResponse.json(null, {
            status: 401,
            statusText: "Unauthorized",
          });
        },
      ),
    );

    const client = { secretKey: "valid_secret_key" } as ThirdwebClient;
    const options = {
      client,
      name: "Test Ecosystem",
      logoUrl: "http://example.com/logo.png",
    };

    await expect(createWalletEcosystem(options)).rejects.toThrow(
      "Unauthorized - You don't have permission to use this service. Make sure your secret key is set on your client.",
    );
  });
});
