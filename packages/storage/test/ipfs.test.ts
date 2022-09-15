import { ThirdwebStorage } from "../src";
import { assert } from "chai";
import { readFileSync } from "fs";

describe("IPFS", async () => {
  const storage = new ThirdwebStorage();

  it("Should upload buffer with file number", async () => {
    const uri = await storage.upload(readFileSync("test/files/0.jpg"));
    assert(uri.endsWith("0"));
  });

  it("Should upload buffer with name", async () => {
    const uri = await storage.upload({
      name: "0.jpg",
      data: readFileSync("test/files/0.jpg"),
    });
    assert(uri.endsWith("0.jpg"));
  });

  it("Should upload and download JSON object", async () => {
    const uri = await storage.upload({
      name: "Goku",
      description: "The strongest human in the world",
      properties: [
        {
          name: "Strength",
          value: "100",
        },
      ],
    });
    assert(uri.endsWith("0"));

    const data = await storage.downloadJSON(uri);
    assert(data.name === "Goku");
    assert(data.description === "The strongest human in the world");
    assert(data.properties.length === 1);
  });

  it("Should batch upload buffers with names", async () => {
    const uris = await storage.uploadBatch([
      {
        data: readFileSync("test/files/0.jpg"),
        name: "0.jpg",
      },
      {
        data: readFileSync("test/files/1.jpg"),
        name: "1.jpg",
      },
    ]);

    assert(uris[0].endsWith("0.jpg"));
    assert(uris[1].endsWith("1.jpg"));
  });

  it("Should batch upload JSON objects", async () => {
    const uris = await storage.uploadBatch([
      {
        name: "Goku",
        strength: 100,
        powerLevel: "Over 9000",
      },
      {
        name: "Vegeta",
        strenth: 90,
        powerLevel: "5000",
      },
    ]);

    assert(uris[0].endsWith("0"));
    assert(uris[1].endsWith("1"));

    const data0 = await storage.downloadJSON(uris[0]);
    const data1 = await storage.downloadJSON(uris[1]);

    assert(data0.name === "Goku");
    assert(data1.name === "Vegeta");
  });

  it("Should upload an MP4 file", async () => {
    const uri = await storage.upload({
      animation_url: readFileSync("test/files/test.mp4"),
    });

    console.log(uri);

    assert(uri === "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0");
  });
});
