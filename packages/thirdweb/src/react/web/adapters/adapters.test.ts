import { beforeEach, describe, expect, it, vi } from "vitest";
import { WebWindowAdapter } from "./WindowAdapter.js";

describe("WebWindowAdapter", () => {
  let windowAdapter: WebWindowAdapter;
  let mockOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    windowAdapter = new WebWindowAdapter();

    // Mock window.open using vi.stubGlobal
    mockOpen = vi.fn();
    vi.stubGlobal("window", {
      open: mockOpen,
    });
  });

  it("should open URL in new tab with correct parameters", async () => {
    const mockWindow = {} as Partial<Window>;
    mockOpen.mockReturnValue(mockWindow);

    await windowAdapter.open("https://example.com");

    expect(mockOpen).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
