import { getCID } from "../src";
import { expect } from "chai";

describe("CID", async () => {
  it("Should correctly get CID of a string", async () => {
    const cid = await getCID("hello world");
    expect(cid).to.equal("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
  });
});
