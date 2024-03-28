import { sha256, sha256Hex, sha256Sync, sha256HexSync } from "../src";
import { createHash } from "node:crypto";

const STRING_TO_HASH = "hello world";

describe("sha256", () => {
  it("sha256", async () => {
    const out = await sha256(STRING_TO_HASH);
    const hash = createHash("sha256").update(STRING_TO_HASH).digest();
    expect(out).toEqual(hash);
  });

  it("sha256 -> hex", async () => {
    const out = await sha256Hex(STRING_TO_HASH);
    const hash = createHash("sha256").update(STRING_TO_HASH).digest("hex");
    expect(out).toEqual(hash);
  });

  it("sha256Sync", async () => {
    const out = sha256Sync(STRING_TO_HASH);
    const hash = createHash("sha256").update(STRING_TO_HASH).digest();
    expect(out).toEqual(hash);
  });

  it("sha256Sync -> hex", async () => {
    const out = sha256HexSync(STRING_TO_HASH);
    const hash = createHash("sha256").update(STRING_TO_HASH).digest("hex");
    expect(out).toEqual(hash);
  });
});
