import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { getEcosystems } from "./get-ecosystems.js";

const handlers = [
  http.get(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider`,
    () => {
      return HttpResponse.json([
        {
          id: "ecosystem_id",
          name: "Sample Ecosystem",
          logoUrl: "http://example.com/logo.png",
          createdAt: "2024-05-05T00:00:00.000Z",
        },
      ]);
    },
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe.sequential("getEcosystems", () => {
  it("should throw an error if secret key is missing", async () => {
    const client = { secretKey: "" } as ThirdwebClient;
    const options = {
      client,
    };

    await expect(getEcosystems(options)).rejects.toThrow(
      "Unauthorized - Secret Key is required to retrieve an ecosystem.",
    );
  });

  it("should retrieve a wallet ecosystem successfully", async () => {
    const client = { secretKey: "valid_secret_key" } as ThirdwebClient;
    const options = {
      client,
    };

    const result = await getEcosystems(options);
    expect(result).toEqual([
      {
        id: "ecosystem_id",
        name: "Sample Ecosystem",
        logoUrl: "http://example.com/logo.png",
        createdAt: "2024-05-05T00:00:00.000Z",
      },
    ]);
  });

  it("should handle API errors", async () => {
    server.use(
      http.get(
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
    };

    await expect(getEcosystems(options)).rejects.toThrow(
      "Unauthorized - You don't have permission to use this service. Make sure your secret key is set on your client.",
    );
  });
});
