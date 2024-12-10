import { describe, expect, it } from "vitest";
import { roleBytes } from "./role-bytes.js";

describe("roleBytes", () => {
  it("should calculate the value of lister role", () => {
    expect(roleBytes("LISTER_ROLE")).toBe(
      "0xf94103142c1baabe9ac2b5d1487bf783de9e69cfeea9a72f5c9c94afd7877b8c",
    );
  });
});
