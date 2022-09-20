/* eslint-disable no-unused-expressions */
import { IpfsUploader, ThirdwebStorage } from "../src";
import { DEFAULT_GATEWAY_URLS } from "../src/common/urls";
import { expect } from "chai";
import { readFileSync } from "fs";

describe("IPFS", async () => {
  const storage = new ThirdwebStorage();

  it("Should upload buffer with file number", async () => {
    const uri = await storage.upload(readFileSync("test/files/0.jpg"));

    expect(uri.endsWith("0"), `${uri} does not end with '0'`).to.be.true;
  });

  it("Should upload buffer with name", async () => {
    const uri = await storage.upload({
      name: "0.jpg",
      data: readFileSync("test/files/0.jpg"),
    });
    expect(uri.endsWith("0.jpg"), `${uri} does not end with '0.jpg'`).to.be
      .true;
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
    expect(uri.endsWith("0"), `${uri} does not end with '0'`).to.be.true;

    const data = await storage.downloadJSON(uri);
    expect(data.name).to.equal("Goku");
    expect(data.description).to.equal("The strongest human in the world");
    expect(data.properties.length).to.equal(1);
  });

  it("Should batch upload strings with names", async () => {
    const uris = await storage.uploadBatch([
      {
        data: "data1",
        name: "first",
      },
      {
        data: "data2",
        name: "second",
      },
    ]);

    expect(uris[0].endsWith("first"), `${uris[0]} does not end with 'first'`).to
      .be.true;
    expect(uris[1].endsWith("second"), `${uris[1]} does not end with 'second'`)
      .to.be.true;

    const data1 = await (await storage.download(uris[0])).text();
    expect(data1).to.equal("data1");
    const data2 = await (await storage.download(uris[1])).text();
    expect(data2).to.equal("data2");
  });

  it("Should batch upload buffers with names", async () => {
    const uris = await storage.uploadBatch([
      {
        data: readFileSync("test/files/0.jpg"),
        name: "first.jpg",
      },
      {
        data: readFileSync("test/files/1.jpg"),
        name: "second.jpg",
      },
    ]);

    expect(
      uris[0].endsWith("first.jpg"),
      `${uris[0]} does not end with 'first.jpg'`,
    ).to.be.true;
    expect(
      uris[1].endsWith("second.jpg"),
      `${uris[1]} does not end with '0.jpg'`,
    ).to.be.true;
  });

  it("Should rewrite file names to numbers if specified", async () => {
    const uris = await storage.uploadBatch(
      [
        {
          data: readFileSync("test/files/0.jpg"),
          name: "first.jpg",
        },
        {
          data: readFileSync("test/files/1.jpg"),
          name: "second.jpg",
        },
      ],
      {
        rewriteFileNames: {
          fileStartNumber: 0,
        },
      },
    );

    expect(uris[0].endsWith("0"), `${uris[0]} does not end with '0'`).to.be
      .true;
    expect(uris[1].endsWith("1"), `${uris[1]} does not end with '1'`).to.be
      .true;
  });

  it("Should rewrite files with non zero start file number", async () => {
    const uris = await storage.uploadBatch(
      [
        {
          data: readFileSync("test/files/0.jpg"),
          name: "first.jpg",
        },
        {
          data: readFileSync("test/files/1.jpg"),
          name: "second.jpg",
        },
      ],
      {
        rewriteFileNames: {
          fileStartNumber: 5,
        },
      },
    );

    expect(uris[0].endsWith("5"), `${uris[0]} does not end with '5'`).to.be
      .true;
    expect(uris[1].endsWith("6"), `${uris[1]} does not end with '6'`).to.be
      .true;
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

    expect(uris[0].endsWith("0"), `${uris[0]} does not end with '0'`).to.be
      .true;
    expect(uris[1].endsWith("1"), `${uris[1]} does not end with '0.jpg'`).to.be
      .true;

    const data0 = await storage.downloadJSON(uris[0]);
    const data1 = await storage.downloadJSON(uris[1]);

    expect(data0.name).to.equal("Goku");
    expect(data1.name).to.equal("Vegeta");
  });

  it("Should upload an MP4 file", async () => {
    const uri = await storage.upload({
      animation_url: readFileSync("test/files/test.mp4"),
    });

    expect(uri).to.equal(
      "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
    );
  });

  it("Should upload without directory if specified on function", async () => {
    const uri = await storage.upload(
      {
        name: "Upload Without Directory",
        description: "Uploading alone without a directory...",
      },
      {
        uploadWithoutDirectory: true,
      },
    );

    expect(uri).to.equal(
      "ipfs://QmdnBEP9UFcRfbuAyXFefNccNbuKWTscHrpWZatvqz9VcV",
    );

    const json = await storage.downloadJSON(uri);

    expect(json.name).to.equal("Upload Without Directory");
    expect(json.description).to.equal("Uploading alone without a directory...");
  });

  it("Should upload without directory if specified on class", async () => {
    const solanaStorage = new ThirdwebStorage(
      new IpfsUploader({ uploadWithGatewayUrl: true }),
    );

    const uri = await solanaStorage.upload(
      {
        name: "Upload Without Directory",
        description: "Uploading alone without a directory...",
      },
      {
        uploadWithoutDirectory: true,
      },
    );

    expect(uri).to.equal(
      "ipfs://QmdnBEP9UFcRfbuAyXFefNccNbuKWTscHrpWZatvqz9VcV",
    );

    const json = await storage.downloadJSON(uri);

    expect(json.name).to.equal("Upload Without Directory");
    expect(json.description).to.equal("Uploading alone without a directory...");
  });

  it("Should throw an error on upload without directory with multiple uploads", async () => {
    try {
      await storage.uploadBatch(
        [readFileSync("test/files/0.jpg"), readFileSync("test/files/1.jpg")],
        {
          uploadWithoutDirectory: true,
        },
      );
      expect.fail(
        "Failed to throw an error on uploading multiple files without directory",
      );
    } catch (err: any) {
      expect(err.message).to.contain(
        "[UPLOAD_WITHOUT_DIRECTORY_ERROR] Cannot upload more than one file or object without directory!",
      );
    }
  });

  it("Should replace gateway URLs with schemes on upload", async () => {
    const uri = await storage.upload({
      image: `${DEFAULT_GATEWAY_URLS["ipfs://"][0]}QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
    });

    const res = await storage.download(uri);
    const json = await res.json();

    expect(json.image).to.equal(
      "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
    );
  });

  it("Should replace schemes with gateway URLs on download", async () => {
    const uri = await storage.upload({
      image: "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
    });

    const json = await storage.downloadJSON(uri);

    expect(json.image).to.equal(
      `${DEFAULT_GATEWAY_URLS["ipfs://"][0]}QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
    );
  });

  it("Should upload files with gateway URLs if specified", async () => {
    const uri = await storage.upload(
      {
        // Gateway URLs should first be converted back to ipfs:// and then all ipfs:// should convert to first gateway URL
        image: `${DEFAULT_GATEWAY_URLS["ipfs://"][1]}QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
        animation_url:
          "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
      },
      {
        uploadWithGatewayUrl: true,
      },
    );

    const res = await storage.download(uri);
    const json = await res.json();

    expect(json.image).to.equal(
      `${DEFAULT_GATEWAY_URLS["ipfs://"][0]}QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
    );
    expect(json.animation_url).to.equal(
      `${DEFAULT_GATEWAY_URLS["ipfs://"][0]}QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
    );
  });

  it("Should throw an error when trying to upload files with the same name", async () => {
    try {
      await storage.uploadBatch([
        {
          data: readFileSync("test/files/0.jpg"),
          name: "0.jpg",
        },
        {
          data: readFileSync("test/files/1.jpg"),
          name: "0.jpg",
        },
      ]);
      expect.fail("Uploading files with same name did not throw an error.");
    } catch (err: any) {
      expect(err.message).to.contain(
        "[DUPLICATE_FILE_NAME_ERROR] File name 0.jpg was passed for more than one file.",
      );
    }
  });

  it("Should recursively upload and replace files", async () => {
    // Should test nested within objects and arrays
    const uris = await storage.uploadBatch([
      {
        image: readFileSync("test/files/0.jpg"),
        properties: [
          {
            image: readFileSync("test/files/1.jpg"),
          },
          {
            animation_url: readFileSync("test/files/2.jpg"),
          },
        ],
      },
      {
        image: readFileSync("test/files/3.jpg"),
        properties: [
          readFileSync("test/files/4.jpg"),
          readFileSync("test/files/test.mp4"),
        ],
      },
    ]);

    expect(uris[0]).to.equal(
      "ipfs://QmTtEY2WSTDpzYSXw2G3xsYw3eMs8YephvrfVYd8qia9F9/0",
    );
    expect(uris[1]).to.equal(
      "ipfs://QmTtEY2WSTDpzYSXw2G3xsYw3eMs8YephvrfVYd8qia9F9/1",
    );
  });
});
