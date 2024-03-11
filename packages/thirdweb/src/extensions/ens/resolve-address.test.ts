import { describe, it, expect } from "vitest";
import { resolveAddress } from "./resolve-address.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";

describe("ENS", () => {
  it("should resolve ENS", async () => {
    const name = "vitalik.eth";
    const address = await resolveAddress({
      client: TEST_CLIENT,
      name,
    });
    expect(address).toMatchObject("0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41");
  });
});
