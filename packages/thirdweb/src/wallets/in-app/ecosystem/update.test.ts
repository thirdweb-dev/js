import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { updateWalletEcosystem } from "./update.js";

const handlers = [
  http.patch(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider/:id`,
    async ({ request }) => {
      const body = (await request.json()) as {
        id: string;
        name?: string;
        logoUrl?: string;
      };
      return HttpResponse.json({
        id: body.id,
        name: body.name,
        logoUrl: body.logoUrl,
        updatedAt: new Date().toISOString(),
      });
    },
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe.sequential("updateWalletEcosystem", () => {
  it("should throw an error if secret key is missing", async () => {
    const client = { secretKey: "" } as ThirdwebClient;
    const options = {
      client,
      id: "ecosystem_id",
      name: "Updated Ecosystem",
      logoUrl: "http://example.com/updated_logo.png",
    };

    await expect(updateWalletEcosystem(options)).rejects.toThrow(
      "Unauthorized - Secret Key is required to update a wallet ecosystem.",
    );
  });

  it("should update a wallet ecosystem successfully", async () => {
    const client = { secretKey: "valid_secret_key" } as ThirdwebClient;
    const options = {
      client,
      id: "ecosystem_id",
      name: "Updated Ecosystem",
      logoUrl: "http://example.com/updated_logo.png",
    };

    const result = await updateWalletEcosystem(options);
    expect(result).toBe(true);
  });

  it("should handle API errors", async () => {
    server.use(
      http.patch(
        `https://${
          getThirdwebDomains().inAppWallet
        }/api/2024-05-05/ecosystem-wallet/provider/:id`,
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
      id: "ecosystem_id",
      name: "Invalid Ecosystem",
      logoUrl: "http://example.com/invalid_logo.png",
    };

    await expect(updateWalletEcosystem(options)).rejects.toThrow(
      "Unauthorized - You don't have permission to use this service. Make sure your secret key is set on your client.",
    );
  });
});
