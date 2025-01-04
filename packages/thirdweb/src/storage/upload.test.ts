import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { detectPlatform } from "../utils/detect-platform.js";
import { upload } from "./upload.js";

describe.runIf(process.env.TW_SECRET_KEY)("Storage:upload", () => {
  it("should return null if files length is zero", async () => {
    expect(await upload({ client: TEST_CLIENT, files: [] })).toBe(null);
  });

  it("should throw an error if using upload() in mobile env", async () => {
    vi.mock("../utils/detect-platform.js");
    vi.mocked(detectPlatform).mockReturnValue("mobile");
    await expect(() =>
      upload({ client: TEST_CLIENT, files: ["hello"] }),
    ).rejects.toThrowError(
      "Please, use the uploadMobile function in mobile environments.",
    );
    vi.resetAllMocks();
  });
});
