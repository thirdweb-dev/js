import { describe, expect, it } from "vitest";
import { renderHook } from "~test/react-render.js";
import { useConnectionManager } from "./connection-manager.js";

describe("useConnectionManager", () => {
  it("throws an error when used outside of ThirdwebProvider", () => {
    expect(() => {
      renderHook(() => useConnectionManager());
    }).toThrow("useConnectionManager must be used within <ThirdwebProvider>");
  });
});
