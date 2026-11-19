import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { NextRequest } from "next/server";
import { getAddress } from "thirdweb/utils";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { GET } from "./route";

const { values, cookieStore } = vi.hoisted(() => {
  const values = new Map<string, string>();
  return {
    values,
    cookieStore: {
      get: vi.fn((name: string) => {
        const value = values.get(name);
        return value === undefined ? undefined : { name, value };
      }),
      getAll: vi.fn(() =>
        Array.from(values, ([name, value]) => ({ name, value })),
      ),
      delete: vi.fn((name: string) => values.delete(name)),
      set: vi.fn(),
    },
  };
});

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("@/constants/public-envs", () => ({
  NEXT_PUBLIC_THIRDWEB_API_HOST: "https://api.example.test",
}));

const address = getAddress("0x0000000000000000000000000000000000000001");
const token = "test-token-not-a-real-credential";
const server = setupServer();

function request(value: string | undefined = address): NextRequest {
  const url = new URL("https://dashboard.example.test/api/auth/ensure-login");
  if (value !== undefined) {
    url.searchParams.set("address", value);
  }
  return new NextRequest(url);
}

describe("ensure-login", () => {
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  beforeEach(() => {
    values.clear();
    vi.clearAllMocks();
  });

  it("returns only login status and keeps the bearer token server-side", async () => {
    values.set(COOKIE_PREFIX_TOKEN + address, token);
    server.use(
      http.get("https://api.example.test/v1/account/me", ({ request }) => {
        expect(request.headers.get("authorization")).toBe(`Bearer ${token}`);
        return HttpResponse.json({ id: "test-account" });
      }),
    );

    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ isLoggedIn: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(cookieStore.set).toHaveBeenCalledWith(
      COOKIE_ACTIVE_ACCOUNT,
      address,
      {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60,
        sameSite: "strict",
        secure: true,
      },
    );
    expect(values.get(COOKIE_PREFIX_TOKEN + address)).toBe(token);
  });

  it("does not cache logged-out status without a token", async () => {
    const response = await GET(request());
    expect(await response.json()).toEqual({ isLoggedIn: false });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(cookieStore.delete).toHaveBeenCalledWith(COOKIE_ACTIVE_ACCOUNT);
  });

  it("clears account cookies and does not cache logout", async () => {
    values.set(COOKIE_PREFIX_TOKEN + address, token);
    values.set(COOKIE_ACTIVE_ACCOUNT, address);
    values.set("unrelated", "keep");
    const url = new URL("https://dashboard.example.test/api/auth/ensure-login");
    const response = await GET(new NextRequest(url));
    expect(await response.json()).toEqual({ isLoggedIn: false });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(values.has(COOKIE_PREFIX_TOKEN + address)).toBe(false);
    expect(values.has(COOKIE_ACTIVE_ACCOUNT)).toBe(false);
    expect(values.get("unrelated")).toBe("keep");
  });

  it("does not cache invalid-token status and removes the rejected token", async () => {
    values.set(COOKIE_PREFIX_TOKEN + address, token);
    server.use(
      http.get(
        "https://api.example.test/v1/account/me",
        () => new HttpResponse(null, { status: 401 }),
      ),
    );
    const response = await GET(request());
    expect(await response.json()).toEqual({ isLoggedIn: false });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(values.has(COOKIE_PREFIX_TOKEN + address)).toBe(false);
  });

  it.each(["invalid", "0x1234", `0x${"z".repeat(40)}`])(
    "rejects malformed address %s without reading token cookies",
    async (invalidAddress) => {
      const response = await GET(request(invalidAddress));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "Invalid address" });
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(cookieStore.get).not.toHaveBeenCalled();
    },
  );
});
