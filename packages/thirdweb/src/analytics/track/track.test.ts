import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ThirdwebClient } from "../../client/client.js";
import { track } from "./index.js";

const server = setupServer(
  http.post("https://c.thirdweb.com/event", () => {
    return HttpResponse.json({});
  }),
);

describe("track", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should send a POST request with correct data", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestBody: unknown;
    server.use(
      http.post("https://c.thirdweb.com/event", async (handler) => {
        requestBody = await handler.request.json();
        return HttpResponse.json({});
      }),
    );

    await track({
      client: mockClient,
      data: {
        action: "test-action",
        data: "test-data",
      },
    });

    expect(requestBody).toEqual({
      action: "test-action",
      data: "test-data",
      source: "sdk",
    });
  });

  it("should not throw an error if the request fails", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    server.use(
      http.post("https://c.thirdweb.com/event", () => {
        return HttpResponse.error();
      }),
    );

    expect(() =>
      track({
        client: mockClient,
        data: {
          action: "test-action",
          data: "test-data",
        },
      }),
    ).not.toThrowError();

    // Wait for the asynchronous POST request to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("should send a POST request with correct headers", async () => {
    const mockClient: ThirdwebClient = {
      clientId: "test-client-id",
      secretKey: undefined,
    };

    let requestHeaders: Headers | undefined;
    server.use(
      http.post("https://c.thirdweb.com/event", (handler) => {
        requestHeaders = handler.request.headers;
        return HttpResponse.json({});
      }),
    );

    await track({
      client: mockClient,
      data: {
        action: "test-action",
        data: "test-data",
      },
      ecosystem: {
        id: "ecosystem.test-ecosystem-id",
        partnerId: "test-partner-id",
      },
    });

    expect(requestHeaders?.get("x-client-id")).toEqual("test-client-id");
    expect(requestHeaders?.get("x-ecosystem-id")).toEqual(
      "ecosystem.test-ecosystem-id",
    );
    expect(requestHeaders?.get("x-ecosystem-partner-id")).toEqual(
      "test-partner-id",
    );
  });
});
