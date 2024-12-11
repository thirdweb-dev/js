import { describe, expect, it, vi } from "vitest";
import { webLocalStorage } from "../../../utils/storage/webStorage.js";
import { LAST_AUTH_PROVIDER_STORAGE_KEY } from "../../core/utils/storage.js";
import { getLastAuthProvider } from "./storage.js";

vi.mock("../../../utils/storage/webStorage.js", () => ({
  webLocalStorage: {
    getItem: vi.fn().mockResolvedValueOnce("mockStrategy"),
  },
}));

describe("getLastAuthProvider", () => {
  it("should return the last authentication provider strategy if it exists", async () => {
    const mockStrategy = "mockStrategy";
    webLocalStorage.getItem = vi.fn().mockResolvedValueOnce(mockStrategy);

    const result = await getLastAuthProvider();
    expect(result).toBe(mockStrategy);
  });

  it("should return null if no authentication provider strategy is found", async () => {
    webLocalStorage.getItem = vi.fn().mockResolvedValueOnce(null);

    const result = await getLastAuthProvider();
    expect(result).toBeNull();
  });

  it("should call webLocalStorage.getItem with the correct key", async () => {
    await getLastAuthProvider();
    expect(webLocalStorage.getItem).toHaveBeenCalledWith(
      LAST_AUTH_PROVIDER_STORAGE_KEY,
    );
  });
});
