import { getCID } from "../src";
import { expect } from "chai";
import fs from "fs";

describe("CID", async () => {
  it("Should correctly get CID of a string", async () => {
    const cid = await getCID("hello world");
    expect(cid).to.equal("Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD");
  });

  it("Should correctly get CID of a file", async () => {
    const cid = await getCID(fs.readFileSync("test/files/0.jpg"));
    expect(cid).to.equal("QmSBs7aGB52CF2kXdQaHS6kvQuFACufCbfMKjrB5gSytiT");
  });
});
