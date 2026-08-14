import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { sendOtp, verifyOtp } from "./otp.js";

vi.mock("../../../../../utils/fetch.js");

describe("sendOtp", () => {
  it("should route the request through getClientFetch so platform headers (x-bundle-id) are attached", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
    });
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);

    await sendOtp({
      client: TEST_CLIENT,
      email: "user@example.com",
      strategy: "email",
    });

    expect(getClientFetch).toHaveBeenCalledWith(TEST_CLIENT, undefined);
    expect(mockFetch).toHaveBeenCalled();
  });

  it("should forward the ecosystem to getClientFetch so ecosystem headers are attached", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
    });
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);

    const ecosystem = { id: "ecosystem.test" as const, partnerId: "partner-1" };
    await sendOtp({
      client: TEST_CLIENT,
      ecosystem,
      email: "user@example.com",
      strategy: "email",
    });

    expect(getClientFetch).toHaveBeenCalledWith(TEST_CLIENT, ecosystem);
  });
});

describe("verifyOtp", () => {
  it("should route the request through getClientFetch so platform headers (x-bundle-id) are attached", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
    });
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);

    await verifyOtp({
      client: TEST_CLIENT,
      email: "user@example.com",
      strategy: "email",
      verificationCode: "123456",
    });

    expect(getClientFetch).toHaveBeenCalledWith(TEST_CLIENT, undefined);
    expect(mockFetch).toHaveBeenCalled();
  });

  it("should forward the ecosystem to getClientFetch so ecosystem headers are attached", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
    });
    vi.mocked(getClientFetch).mockReturnValue(mockFetch);

    const ecosystem = { id: "ecosystem.test" as const, partnerId: "partner-1" };
    await verifyOtp({
      client: TEST_CLIENT,
      ecosystem,
      email: "user@example.com",
      strategy: "email",
      verificationCode: "123456",
    });

    expect(getClientFetch).toHaveBeenCalledWith(TEST_CLIENT, ecosystem);
  });
});
