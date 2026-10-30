import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { resolve } from "./__generated__/UniversalResolver/read/resolve.js";
import { resolveText } from "./resolve-text.js";

vi.mock("./__generated__/UniversalResolver/read/resolve.js", () => ({
  resolve: vi.fn(),
}));

describe("resolveText errors", () => {
  beforeEach(() => {
    vi.mocked(resolve).mockReset();
  });

  it("returns null when the name has no resolver", async () => {
    vi.mocked(resolve).mockRejectedValue({
      code: 3,
      data: "0x77209fe800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
      message: "execution reverted",
    });

    await expect(
      resolveText({
        client: TEST_CLIENT,
        key: "avatar",
        name: "no-resolver-test-1.eth",
      }),
    ).resolves.toBeNull();
  });

  it("rethrows other errors", async () => {
    const error = {
      code: 3,
      data: "0x12345678",
      message: "execution reverted",
    };
    vi.mocked(resolve).mockRejectedValue(error);

    await expect(
      resolveText({
        client: TEST_CLIENT,
        key: "avatar",
        name: "no-resolver-test-2.eth",
      }),
    ).rejects.toBe(error);
  });
});
