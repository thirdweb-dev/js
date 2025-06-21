import { http, passthrough } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { routes } from "./Routes.js";

const server = setupServer(
  http.get("https://bridge.thirdweb.com/v1/routes", () => {
    passthrough();
  }),
);

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.routes", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should get a valid list of routes", async () => {
    const allRoutes = await routes({
      client: TEST_CLIENT,
    });

    expect(allRoutes).toBeDefined();
    expect(Array.isArray(allRoutes)).toBe(true);
  });

  it("should filter routes by origin chain", async () => {
    const filteredRoutes = await routes({
      client: TEST_CLIENT,
      originChainId: 1,
    });

    expect(filteredRoutes).toBeDefined();
    expect(Array.isArray(filteredRoutes)).toBe(true);
    expect(
      filteredRoutes.every((route) => route.originToken.chainId === 1),
    ).toBe(true);
  });

  it("should filter routes by destination chain", async () => {
    const filteredRoutes = await routes({
      client: TEST_CLIENT,
      destinationChainId: 1,
    });

    expect(filteredRoutes).toBeDefined();
    expect(Array.isArray(filteredRoutes)).toBe(true);
    expect(
      filteredRoutes.every((route) => route.destinationToken.chainId === 1),
    ).toBe(true);
  });

  it("should filter routes by origin token", async () => {
    const filteredRoutes = await routes({
      client: TEST_CLIENT,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    });

    expect(filteredRoutes).toBeDefined();
    expect(Array.isArray(filteredRoutes)).toBe(true);
    expect(
      filteredRoutes.every(
        (route) =>
          route.originToken.address ===
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      ),
    ).toBe(true);
  });

  it("should filter routes by destination token", async () => {
    const filteredRoutes = await routes({
      client: TEST_CLIENT,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    });

    expect(filteredRoutes).toBeDefined();
    expect(Array.isArray(filteredRoutes)).toBe(true);
    expect(
      filteredRoutes.every(
        (route) =>
          route.destinationToken.address ===
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      ),
    ).toBe(true);
  });

  it("should combine filters", async () => {
    const filteredRoutes = await routes({
      client: TEST_CLIENT,
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    });

    expect(filteredRoutes).toBeDefined();
    expect(Array.isArray(filteredRoutes)).toBe(true);
    expect(filteredRoutes.length).toBeGreaterThan(0);
    expect(
      filteredRoutes.every(
        (route) =>
          route.originToken.chainId === 1 &&
          route.destinationToken.chainId === 10 &&
          route.originToken.address ===
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" &&
          route.destinationToken.address ===
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      ),
    ).toBe(true);
  });

  it("should respect limit and offset", async () => {
    const page1Routes = await routes({
      client: TEST_CLIENT,
      limit: 1,
      offset: 1,
    });

    expect(page1Routes).toBeDefined();
    expect(Array.isArray(page1Routes)).toBe(true);
    expect(page1Routes.length).toBe(1);

    const page2Routes = await routes({
      client: TEST_CLIENT,
      limit: 1,
      offset: 2,
    });

    expect(page2Routes).toBeDefined();
    expect(Array.isArray(page2Routes)).toBe(true);
    expect(page2Routes.length).toBe(1);

    expect(JSON.stringify(page1Routes)).not.toEqual(
      JSON.stringify(page2Routes),
    );
  });

  it("should surface any errors", async () => {
    server.use(
      http.get("https://bridge.thirdweb.com/v1/routes", () => {
        return Response.json(
          {
            code: "InvalidRoutesRequest",
            message: "The provided request is invalid.",
          },
          { status: 400 },
        );
      }),
    );

    await expect(
      routes({
        client: TEST_CLIENT,
        limit: 1000,
        offset: 1000,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[Error: The provided request is invalid.]",
    );
  });
});
