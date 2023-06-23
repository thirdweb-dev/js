import { getCID } from "../src";
import { expect } from "chai";
import fs from "fs";

describe("CID", async () => {
  it("Should correctly get CID of a string", async () => {
    const cid = await getCID(
      [{ content: new TextEncoder().encode("hello world") }],
      false,
    );
    expect(cid).to.equal("bafybeihykld7uyxzogax6vgyvag42y7464eywpf55gxi5qpoisibh3c5wa");
  });

  it("Should correctly get CID of a file", async () => {
    const cid = await getCID(
      [{ content: fs.readFileSync("test/files/0.jpg") }],
      false,
    );
    expect(cid).to.equal("bafybeibzf2f55kjfljocohhwjbeuxlohcdebvovimcaexq53tn4jx5mria");
  });

  it("Should correctly upload directory", async () => {
    const files = [
      { path: "0.jpg", content: fs.readFileSync("test/files/0.jpg") },
      { path: "1.jpg", content: fs.readFileSync("test/files/1.jpg") },
    ];
    const cid = await getCID(files);
    expect(cid).to.equal("bafybeie4vcsw3ew6io6paaltdvwkpcoeyn6uoewvu7op7fhhztpnivqnyy");
  });
});
