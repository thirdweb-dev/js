import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { checkVerificationStatus } from "./index.js";

const server = setupServer();

describe("checkVerificationStatus", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("sends the API key unchanged", async () => {
    let apikey: string | null = null;
    server.use(
      http.get("https://api.etherscan.test/api", ({ request }) => {
        apikey = new URL(request.url).searchParams.get("apikey");
        return HttpResponse.json({
          message: "OK",
          result: "Pass - Verified",
          status: "1",
        });
      }),
    );

    const result = await checkVerificationStatus({
      explorerApiKey: "TEST_API_KEY",
      explorerApiUrl: "https://api.etherscan.test/api",
      guid: "test-guid",
    });

    expect(apikey).toBe("TEST_API_KEY");
    expect(result).toEqual({
      message: "OK",
      result: "Pass - Verified",
      status: "1",
    });
  }, 10_000);
});
