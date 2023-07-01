import { getCID } from "../src";
import { expect } from "chai";
import fs from "fs";

describe("CID", async () => {
  it("Should correctly get CID of a string", async () => {
    const cid = await getCID(
      [{ content: new TextEncoder().encode("hello world") }],
      false,
    );
    expect(cid).to.equal("Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD");
  });

  it("Should correctly get CID of a file", async () => {
    const cid = await getCID(
      [{ content: fs.readFileSync("test/files/0.jpg") }],
      false,
    );
    expect(cid).to.equal("QmSBs7aGB52CF2kXdQaHS6kvQuFACufCbfMKjrB5gSytiT");
  });

  it("Should correctly upload directory", async () => {
    const files = [
      { path: "0.jpg", content: fs.readFileSync("test/files/0.jpg") },
      { path: "1.jpg", content: fs.readFileSync("test/files/1.jpg") },
    ];
    const cid = await getCID(files);
    expect(cid).to.equal("QmYtBTkEnTGrzkns2L8R4rL3keowVg3nGcBhPbwrbAWTRP");
  });
});
