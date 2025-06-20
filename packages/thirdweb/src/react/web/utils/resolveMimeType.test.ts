import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMimeTypeFromUrl } from "../ui/MediaRenderer/mime/mime.js";
import { resolveMimeType } from "./resolveMimeType.js";

// Mock the getMimeTypeFromUrl function
vi.mock("../ui/MediaRenderer/mime/mime.js", () => ({
  getMimeTypeFromUrl: vi.fn(),
}));

describe("resolveMimeType", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return undefined for empty URL", async () => {
    const result = await resolveMimeType();
    expect(result).toBeUndefined();
  });

  it("should return mime type from URL if available", async () => {
    vi.mocked(getMimeTypeFromUrl).mockReturnValue("image/jpeg");
    const result = await resolveMimeType("https://example.com/image.jpg");
    expect(result).toBe("image/jpeg");
    expect(getMimeTypeFromUrl).toHaveBeenCalledWith(
      "https://example.com/image.jpg",
    );
  });

  it("should fetch mime type from server if not available from URL", async () => {
    vi.mocked(getMimeTypeFromUrl).mockReturnValue(null);
    global.fetch = vi.fn().mockResolvedValue({
      headers: new Headers({ "content-type": "application/json" }),
      ok: true,
    });

    const result = await resolveMimeType("https://example.com/data.json");
    expect(result).toBe("application/json");
    expect(global.fetch).toHaveBeenCalledWith("https://example.com/data.json", {
      method: "HEAD",
    });
  });

  it("should return undefined if fetch fails", async () => {
    vi.mocked(getMimeTypeFromUrl).mockReturnValue(null);
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const result = await resolveMimeType("https://example.com/unknown");
    expect(result).toBeUndefined();
  });

  it("should return undefined if content-type header is missing", async () => {
    vi.mocked(getMimeTypeFromUrl).mockReturnValue(null);
    global.fetch = vi.fn().mockResolvedValue({
      headers: new Headers(),
      ok: true,
    });

    const result = await resolveMimeType("https://example.com/noheader");
    expect(result).toBeUndefined();
  });
});
