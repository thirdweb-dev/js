/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { readFileSync } from "fs";
import { getGatewayUrlForCid, IpfsUploader, ThirdwebStorage } from "../src";
import { DEFAULT_GATEWAY_URLS, prepareGatewayUrls } from "../src/common/urls";

// load env variables
require("dotenv-mono").load();

const secretKey = process.env.TW_SECRET_KEY as string;

const itIfCI = process.env.CI ? it : it.skip;

describe("IPFS", async () => {
  if (!secretKey) {
    throw new Error("TW_SECRET_KEY is not set in the environment variables");
  }
  const storage = new ThirdwebStorage({
    secretKey: secretKey,
  });
  const authorizedUrls = prepareGatewayUrls(
    DEFAULT_GATEWAY_URLS,
    undefined,
    secretKey,
  );

  it("Should replace tokens in tokenized gateway URL", async () => {
    const url = getGatewayUrlForCid(
      "https://{cid}.example.com/{path}",
      "QmYtBTkEnTGrzkns2L8R4rL3keowVg3nGcBhPbwrbAWTRP/1.jpg",
    );
    expect(url).to.equal(
      "https://bafybeie4vcsw3ew6io6paaltdvwkpcoeyn6uoewvu7op7fhhztpnivqnyy.example.com/1.jpg",
    );
  });

  it("Should append path to canonical gateway URL", async () => {
    const url = getGatewayUrlForCid(
      "https://example.com/ipfs/",
      "QmYtBTkEnTGrzkns2L8R4rL3keowVg3nGcBhPbwrbAWTRP/1.jpg",
    );
    expect(url).to.equal(
      "https://example.com/ipfs/bafybeie4vcsw3ew6io6paaltdvwkpcoeyn6uoewvu7op7fhhztpnivqnyy/1.jpg",
    );
  });

  it("Should resolve scheme with gateway URL", async () => {
    const uri = `ipfs://QmYtBTkEnTGrzkns2L8R4rL3keowVg3nGcBhPbwrbAWTRP`;
    const url = storage.resolveScheme(uri);
    expect(url).to.equal(
      getGatewayUrlForCid(
        authorizedUrls["ipfs://"][0],
        "bafybeie4vcsw3ew6io6paaltdvwkpcoeyn6uoewvu7op7fhhztpnivqnyy",
      ),
    );
  });

  it("Should upload buffer with file number", async () => {
    const uri = await storage.upload(readFileSync("test/files/0.jpg"), {
      alwaysUpload: true,
    });

    expect(uri.endsWith("0"), `${uri} does not end with '0'`).to.be.true;
  });

  it("Should upload buffer with name", async () => {
    const uri = await storage.upload(
      {
        name: "0.jpg",
        data: readFileSync("test/files/0.jpg"),
      },
      { alwaysUpload: true },
    );
    expect(uri.endsWith("0.jpg"), `${uri} does not end with '0.jpg'`).to.be
      .true;
  });

  it("Should upload and download JSON object", async () => {
    const uri = await storage.upload(
      {
        name: "Goku",
        description: "The strongest human in the world",
        properties: [
          {
            name: "Strength",
            value: "100",
          },
        ],
      },
      {
        alwaysUpload: true,
      },
    );
    expect(uri.endsWith("0"), `${uri} does not end with '0'`).to.be.true;

    const data = await storage.downloadJSON(uri);
    expect(data.name).to.equal("Goku");
    expect(data.description).to.equal("The strongest human in the world");
    expect(data.properties.length).to.equal(1);
  });

  it("Should batch upload strings with names", async () => {
    const uris = await storage.uploadBatch(
      [
        {
          data: "data1",
          name: "first",
        },
        {
          data: "data2",
          name: "second",
        },
      ],
      {
        alwaysUpload: true,
      },
    );

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
        alwaysUpload: true,
      },
    );

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
        alwaysUpload: true,
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
        alwaysUpload: true,
      },
    );

    expect(uris[0].endsWith("5"), `${uris[0]} does not end with '5'`).to.be
      .true;
    expect(uris[1].endsWith("6"), `${uris[1]} does not end with '6'`).to.be
      .true;
  });

  it("Should batch upload JSON objects", async () => {
    const uris = await storage.uploadBatch(
      [
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
      ],
      {
        alwaysUpload: true,
      },
    );

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
    const uri = await storage.upload(
      {
        animation_url: readFileSync("test/files/test.mp4"),
      },
      {
        alwaysUpload: true,
      },
    );

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
        alwaysUpload: true,
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
          alwaysUpload: true,
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
    const uri = await storage.upload(
      {
        image: getGatewayUrlForCid(
          authorizedUrls["ipfs://"][0],
          `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
        ),
      },
      {
        alwaysUpload: true,
      },
    );

    const res = await storage.download(uri);
    const json = await res.json();

    expect(json.image).to.equal(
      "ipfs://bafybeigevrfayusjh2nvk7fqlydj6m3wcagluen5mizxewr6zfx2qk2sy4/0",
    );
  });

  it("Should replace schemes with gateway URLs on download", async () => {
    const uri = await storage.upload(
      {
        image: "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
      },
      {
        alwaysUpload: true,
      },
    );

    const json = await storage.downloadJSON(uri);

    expect(json.image).to.equal(
      getGatewayUrlForCid(
        authorizedUrls["ipfs://"][0],
        `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
      ),
    );
  });

  it("Should upload files with gateway URLs if specified on class", async () => {
    const uploader = new IpfsUploader({
      uploadWithGatewayUrl: true,
      secretKey,
    });
    const singleStorage = new ThirdwebStorage({
      uploader,
      secretKey,
    });
    const _authorizedUrls = prepareGatewayUrls(
      DEFAULT_GATEWAY_URLS,
      undefined,
      secretKey,
    );

    const uri = await singleStorage.upload(
      {
        // Gateway URLs should first be converted back to ipfs:// and then all ipfs:// should convert to first gateway URL
        image: readFileSync("test/files/0.jpg"),
        animation_url:
          "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
      },
      {
        alwaysUpload: true,
      },
    );

    const res = await singleStorage.download(uri);
    const json = await res.json();

    expect(json.image).to.equal(
      getGatewayUrlForCid(
        _authorizedUrls["ipfs://"][0],
        `QmcCJC4T37rykDjR6oorM8hpB9GQWHKWbAi2YR1uTabUZu/0`,
      ),
    );
    expect(json.animation_url).to.equal(
      getGatewayUrlForCid(
        _authorizedUrls["ipfs://"][0],
        `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
      ),
    );
  });

  it("Should upload files with gateway URLs if specified on function", async () => {
    const uri = await storage.upload(
      {
        // Gateway URLs should first be converted back to ipfs:// and then all ipfs:// should convert to first gateway URL
        image: getGatewayUrlForCid(
          authorizedUrls["ipfs://"][0],
          `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
        ),
        animation_url:
          "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0",
      },
      {
        uploadWithGatewayUrl: true,
        alwaysUpload: true,
      },
    );

    const res = await storage.download(uri);
    const json = await res.json();

    expect(json.image).to.equal(
      getGatewayUrlForCid(
        authorizedUrls["ipfs://"][0],
        `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
      ),
    );
    expect(json.animation_url).to.equal(
      getGatewayUrlForCid(
        authorizedUrls["ipfs://"][0],
        `QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0`,
      ),
    );
  });

  // only run this in CI because on local it will always be different (different api key)
  itIfCI(
    "Should return URIs with gateway URLs if specified on function",
    async () => {
      const uri = await storage.upload(
        {
          name: "String",
          image: readFileSync("test/files/0.jpg"),
        },
        {
          uploadWithGatewayUrl: true,
          alwaysUpload: true,
        },
      );

      expect(uri).to.equal(
        getGatewayUrlForCid(
          authorizedUrls["ipfs://"][0],
          // CID changes based on file contents (prod gateway vs staging gateway since they get written)
          `bafybeicn4fmtzb7kcg5idlzoo7ahomt5khqyz7lrpv2r5zz5n7sb4s2uvm/0`,
        ),
      );
    },
  );

  it("Should return URIs with gateway URLs if specified on class", async () => {
    const uploader = new IpfsUploader({
      uploadWithGatewayUrl: true,
      secretKey,
    });
    const storageSingleton = new ThirdwebStorage({
      uploader,
      secretKey,
    });
    const _authorizedUrls = prepareGatewayUrls(
      DEFAULT_GATEWAY_URLS,
      undefined,
      secretKey,
    );

    const uri = await storageSingleton.upload(
      readFileSync("test/files/0.jpg"),
      { alwaysUpload: true },
    );

    expect(uri).to.equal(
      getGatewayUrlForCid(
        _authorizedUrls["ipfs://"][0],
        `QmcCJC4T37rykDjR6oorM8hpB9GQWHKWbAi2YR1uTabUZu/0`,
      ),
    );
  });

  it("Should throw an error when trying to upload different files with the same name", async () => {
    try {
      await storage.uploadBatch(
        [
          {
            data: readFileSync("test/files/0.jpg"),
            name: "0.jpg",
          },
          {
            data: readFileSync("test/files/1.jpg"),
            name: "0.jpg",
          },
        ],
        {
          alwaysUpload: true,
        },
      );
      expect.fail("Uploading files with same name did not throw an error.");
    } catch (err: any) {
      expect(err.message).to.contain(
        "[DUPLICATE_FILE_NAME_ERROR] File name 0.jpg",
      );
    }
  });

  it("Should allow to batch upload the same file multiple times even if they have the same name", async () => {
    const fileNameWithBufferOne = {
      name: "0.jpg",
      data: readFileSync("test/files/0.jpg"),
    };
    const fileNameWithBufferTwo = {
      name: "0.jpg",
      data: readFileSync("test/files/0.jpg"),
    };

    const uris = await storage.uploadBatch(
      [fileNameWithBufferOne, fileNameWithBufferTwo],
      {
        alwaysUpload: true,
      },
    );

    expect(uris[0]).to.equal(uris[1]);
  });

  it("Should recursively upload and replace files", async () => {
    // Should test nested within objects and arrays
    const uris = await storage.uploadBatch(
      [
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
      ],
      {
        alwaysUpload: true,
      },
    );

    expect(uris[0]).to.equal(
      "ipfs://QmTtEY2WSTDpzYSXw2G3xsYw3eMs8YephvrfVYd8qia9F9/0",
    );
    expect(uris[1]).to.equal(
      "ipfs://QmTtEY2WSTDpzYSXw2G3xsYw3eMs8YephvrfVYd8qia9F9/1",
    );
  });

  it("Should successfully upload string", async () => {
    const metadata =
      '{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"}';
    const uri = await storage.upload(metadata, {
      alwaysUpload: true,
    });
    const data = await (await storage.download(uri)).text();

    expect(data).to.equal(metadata);

    const json = await storage.downloadJSON(uri);
    expect(JSON.stringify(json)).to.equal(metadata);
  });

  it("Should succesfully upload boolean", async () => {
    const uri = await storage.upload(false, {
      alwaysUpload: true,
    });
    const data = await storage.downloadJSON(uri);

    expect(data).to.equal(false);
  });

  it("Should succesfully upload number", async () => {
    const uri = await storage.upload(42, {
      alwaysUpload: true,
    });
    const data = await storage.downloadJSON(uri);

    expect(data).to.equal(42);
  });

  it("Should succesfully upload null", async () => {
    const uri = await storage.upload(null, {
      alwaysUpload: true,
    });
    const data = await storage.downloadJSON(uri);

    expect(data).to.equal(null);
  });

  it("Should succesfully upload array", async () => {
    const uri = await storage.upload(["Name", "Description"], {
      alwaysUpload: true,
    });
    const data = await storage.downloadJSON(uri);

    expect(Array.isArray(data)).to.equal(true);
    expect(data.length).to.equal(2);
    expect(data[0]).to.equal("Name");
    expect(data[1]).to.equal("Description");
  });

  it("Should not upload undefined", async () => {
    const uri = await storage.upload(undefined, {
      alwaysUpload: true,
    });
    expect(uri).to.equal(undefined);
  });

  it("should successfully upload files with special characters in their file names", async () => {
    const bufferWithSpecialCharFileName = {
      name: "#specialChar^file$Name.jpg",
      data: readFileSync("test/files/0.jpg"),
    };
    const uri = await storage.upload(bufferWithSpecialCharFileName, {
      alwaysUpload: true,
    });

    const fileNameEncoded = uri.split("/").at(-1);

    expect(fileNameEncoded).to.equal(
      encodeURIComponent(bufferWithSpecialCharFileName.name),
    );

    const res = await storage.download(uri);

    expect(res.status).to.equal(200);
  });
});
