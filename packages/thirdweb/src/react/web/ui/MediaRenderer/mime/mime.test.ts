import { describe, expect, it } from "vitest";
import { getMimeTypeFromUrl } from "./mime.js";
import { extensionsToMimeType } from "./types.js";

describe("getMimeTypeFromUrl", () => {
  it("should return correct mime type for valid file extensions", () => {
    expect(getMimeTypeFromUrl("https://example.com/image.jpg")).toBe(
      "image/jpeg",
    );
    expect(getMimeTypeFromUrl("https://example.com/audio.mp3")).toBe(
      "audio/mpeg",
    );
    expect(getMimeTypeFromUrl("https://example.com/video.mp4")).toBe(
      "video/mp4",
    );
    expect(getMimeTypeFromUrl("https://example.com/document.html")).toBe(
      "text/html",
    );
    expect(getMimeTypeFromUrl("https://example.com/model.gltf")).toBe(
      "model/gltf+json",
    );
  });

  it("should be case-insensitive for file extensions", () => {
    expect(getMimeTypeFromUrl("https://example.com/IMAGE.JPG")).toBe(
      "image/jpeg",
    );
    expect(getMimeTypeFromUrl("https://example.com/AUDIO.MP3")).toBe(
      "audio/mpeg",
    );
  });

  it("should return null for unknown file extensions", () => {
    expect(getMimeTypeFromUrl("https://example.com/unknown.xyz")).toBeNull();
  });

  it("should handle URLs without file extensions", () => {
    expect(getMimeTypeFromUrl("https://example.com/noextension")).toBeNull();
    expect(getMimeTypeFromUrl("https://example.com/")).toBeNull();
  });

  it("should handle URLs with only a file name", () => {
    expect(getMimeTypeFromUrl("image.jpg")).toBe("image/jpeg");
    expect(getMimeTypeFromUrl("audio.mp3")).toBe("audio/mpeg");
  });

  it("should handle URLs with special characters", () => {
    expect(
      getMimeTypeFromUrl("https://example.com/image%20with%20spaces.png"),
    ).toBe("image/png");
    expect(
      getMimeTypeFromUrl(
        "https://example.com/file-name_with-special_chars.mp4",
      ),
    ).toBe("video/mp4");
  });

  it("should return correct mime type for all defined extensions", () => {
    Object.entries(extensionsToMimeType).forEach(([extension, mimeType]) => {
      expect(getMimeTypeFromUrl(`https://example.com/file.${extension}`)).toBe(
        mimeType,
      );
    });
  });
});
