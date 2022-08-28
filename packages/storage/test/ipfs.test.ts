import { PUBLIC_GATEWAYS, DEFAULT_IPFS_GATEWAY } from "../src/constants/urls";
import { IpfsStorage } from "../src/core/ipfs-storage";
import { RemoteStorage } from "../src/core/remote-storage";
import { BufferOrStringWithName, FileOrBuffer } from "../src/types";
import { assert, expect } from "chai";
import { readFileSync } from "fs";

const ipfsGatewayUrl = DEFAULT_IPFS_GATEWAY;

global.fetch = require("cross-fetch");

describe("IPFS Uploads", async () => {
  const storage: IpfsStorage = new IpfsStorage(ipfsGatewayUrl);
  const remoteStorage: RemoteStorage = new RemoteStorage(storage);

  async function getFile(upload: string): Promise<Response> {
    const response = await fetch(
      `${ipfsGatewayUrl}${upload.replace("ipfs://", "")}`
    )
      .then(async (res) => {
        return res;
      })
      .catch((e) => {
        assert.fail(e);
      });

    return response;
  }

  describe("SDK storage interface", async () => {
    it("Should single upload and fetch", async () => {
      const {
        uris: [uri],
      } = await remoteStorage.upload({
        name: "Test Name",
        description: "Test Description",
      });

      const data = await remoteStorage.fetch(uri);

      expect(data.name).to.equal("Test Name");
      expect(data.description).to.equal("Test Description");
    });

    it("Should batch upload and fetch", async () => {
      const { uris } = await remoteStorage.upload([
        {
          name: "Test Name 1",
          description: "Test Description 1",
        },
        {
          name: "Test Name 2",
          description: "Test Description 2",
        },
      ]);

      const data1 = await remoteStorage.fetch(uris[0]);
      const data2 = await remoteStorage.fetch(uris[1]);

      expect(data1.name).to.equal("Test Name 1");
      expect(data1.description).to.equal("Test Description 1");

      expect(data2.name).to.equal("Test Name 2");
      expect(data2.description).to.equal("Test Description 2");
    });
  });

  describe("Custom contract metadata", async () => {
    it("should upload null metadata", async () => {
      try {
        const metadata = JSON.parse(
          readFileSync("test/files/metadata.json", "utf8")
        );
        const upload = await storage.uploadMetadataBatch([metadata]);
        assert.isTrue(upload.uris.length > 0);
      } catch (err) {
        assert.fail(err as string);
      }
    });

    it("should upload metadata and replace gateway urls on upload/download", async () => {
      const upload = await storage.uploadMetadata({
        svg: `${ipfsGatewayUrl}QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/backgrounds/SVG/Asset%20501.svg`,
      });
      const otherStorage = new IpfsStorage(PUBLIC_GATEWAYS[1]);
      const downloaded = await otherStorage.get(upload);
      expect(downloaded.svg).to.eq(
        `${PUBLIC_GATEWAYS[1]}QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/backgrounds/SVG/Asset%20501.svg`
      );
    });

    it.skip("should expose upload progress", async () => {
      let updates = 0;
      await storage.uploadBatch(
        [
          readFileSync("test/files/0.jpg"),
          readFileSync("test/files/1.jpg"),
          readFileSync("test/files/test.mp4"),
        ],
        undefined,
        undefined,
        undefined,
        {
          onProgress: () => {
            updates += 1;
          },
        }
      );

      expect(updates).to.be.greaterThan(0);
    });

    it("should upload a file through any property, even when it is in an object nested inside another object", async () => {
      try {
        const upload = await storage.uploadMetadata({
          name: "test",
          image: readFileSync("test/files/bone.jpg"),
          test: {
            test: {
              image: readFileSync("test/files/bone.jpg"),
            },
          },
        });
        const data = await (await getFile(upload)).json();
        const uploadTest = (await getFile(data.test.test.image)).headers
          ?.get("content-type")
          ?.toString();

        assert.equal(uploadTest, "image/jpeg");
      } catch (err) {
        assert.fail(err as string);
      }
    });

    it("should not upload the string to IPFS", async () => {
      const upload = await storage.uploadMetadata({
        image:
          "ipfs://QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/face_parts/Asset%20331.svg",
      });
      assert.equal(
        upload,
        "ipfs://QmYKJLPfwKduSfWgdLLt49SE6LvzkGzxeYMCkhXWbpJam7/0"
      );
    });

    it("should upload an MP4 file when passed in the animation_url property", async () => {
      const upload = await storage.uploadMetadata({
        animation_url: readFileSync("test/files/test.mp4"),
      });
      assert.equal(
        upload,
        "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0"
      );
    });

    it("should upload an media file and resolve to gateway URL when fetching it", async () => {
      const upload = await storage.uploadMetadata({
        animation_url: readFileSync("test/files/test.mp4"),
      });
      assert.equal(
        upload,
        "ipfs://QmbaNzUcv7KPgdwq9u2qegcptktpUK6CdRZF72eSjSa6iJ/0"
      );
      const meta = await storage.get(upload);
      assert.equal(
        meta.animation_url,
        `${ipfsGatewayUrl}QmUphf8LnNGdFwBevnxNkq8dxcZ4qxzzPjoNMDkSQfECKM/0`
      );
    });

    it("should upload many objects correctly", async () => {
      const sampleObjects: { id: number; description: string; prop: string }[] =
        [
          {
            id: 0,
            description: "test 0",
            prop: "123",
          },
          {
            id: 1,
            description: "test 1",
            prop: "321",
          },
        ];
      const serialized = sampleObjects.map((o) =>
        Buffer.from(JSON.stringify(o))
      );
      const { baseUri: cid } = await storage.uploadBatch(serialized);
      for (const object of sampleObjects) {
        const parsed = await storage.get(`${cid}${object.id}`);
        assert.equal(parsed.description, object.description);
        assert.equal(parsed.id, object.id);
      }
    });

    it("should upload files with filenames correctly", async () => {
      const sampleObjects: BufferOrStringWithName[] = [
        {
          data: readFileSync("test/files/test.mp4"),
          name: "test2.mp4",
        },
        { data: readFileSync("test/files/test.mp4"), name: "test3.mp4" },
        {
          data: readFileSync("test/files/bone.jpg"),
          name: "test.jpeg",
        },
      ];
      const { baseUri: cid } = await storage.uploadBatch(sampleObjects);
      assert(
        (await getFile(`${cid}test.jpeg`)).headers
          ?.get("content-type")
          ?.toString() === "image/jpeg",
        `${cid}`
      );
    });

    it("should upload files according to passed start file number", async () => {
      const sampleObjects: FileOrBuffer[] = [
        readFileSync("test/files/test.mp4"),
        readFileSync("test/files/bone.jpg"),
      ];
      const { baseUri: cid } = await storage.uploadBatch(sampleObjects, 1);
      assert(
        (await getFile(`${cid}2`)).headers?.get("content-type")?.toString() ===
          "image/jpeg",
        `${cid}`
      );
    });
    it("should upload files according to start file number as 0", async () => {
      const sampleObjects = [
        readFileSync("test/files/bone.jpg"),
        readFileSync("test/files/test.mp4"),
      ];
      const { baseUri: cid } = await storage.uploadBatch(sampleObjects);
      assert(
        (await getFile(`${cid}0`)).headers?.get("content-type")?.toString() ===
          "image/jpeg",
        `${cid}`
      );
    });
    it("should upload properties recursively in batch", async () => {
      const sampleObjects: any[] = [
        {
          name: "test 0",
          image: readFileSync("test/files/test.mp4"),
        },
        {
          name: "test 1",
          image: readFileSync("test/files/1.jpg"),
          properties: {
            image: readFileSync("test/files/2.jpg"),
          },
        },
        {
          name: "test 2",
          image: readFileSync("test/files/3.jpg"),
          properties: {
            image: readFileSync("test/files/4.jpg"),
            test: {
              image: readFileSync("test/files/5.jpg"),
            },
          },
        },
      ];
      const { baseUri, uris } = await storage.uploadMetadataBatch(
        sampleObjects
      );
      assert(baseUri.startsWith("ipfs://") && baseUri.endsWith("/"));
      assert(uris.length === sampleObjects.length);
      const [metadata1, metadata2, metadata3] = await Promise.all(
        (
          await Promise.all(uris.map((m) => getFile(m)))
        ).map((m: any) => m.json())
      );
      assert(
        metadata1.image ===
          "ipfs://QmTpv5cWy677mgABsgJgwZ6pe2bEpSWQTvcCb8Hmj3ac8E/0"
      );
      assert(
        metadata2.image ===
          "ipfs://QmTpv5cWy677mgABsgJgwZ6pe2bEpSWQTvcCb8Hmj3ac8E/1"
      );
      assert(
        metadata3.image ===
          "ipfs://QmTpv5cWy677mgABsgJgwZ6pe2bEpSWQTvcCb8Hmj3ac8E/3"
      );
    });

    it("should upload properties in right order", async () => {
      const sampleObjects: any[] = [];
      for (let i = 0; i < 30; i++) {
        const nft = {
          name: `${i}`,
          image: readFileSync(`test/files/${i % 5}.jpg`),
        };
        sampleObjects.push(nft);
      }
      const { baseUri, uris } = await storage.uploadMetadataBatch(
        sampleObjects
      );
      assert(baseUri.startsWith("ipfs://") && baseUri.endsWith("/"));
      assert(uris.length === sampleObjects.length);
      const metadatas = await Promise.all(
        uris.map(async (m) => await storage.get(m))
      );
      for (let i = 0; i < metadatas.length; i++) {
        const expected = sampleObjects[i];
        const downloaded = metadatas[i];
        expect(downloaded.name).to.be.eq(expected.name);
        expect(downloaded.image.endsWith(`${i}`)).to.eq(true);
      }
    });

    it("should upload properly with same file names but one with capitalized letters", async () => {
      const sampleObjects: BufferOrStringWithName[] = [
        {
          data: readFileSync("test/files/test.mp4"),
          name: "test",
        },
        {
          data: readFileSync("test/files/bone.jpg"),
          name: "TEST",
        },
      ];
      const { baseUri: cid } = await storage.uploadBatch(sampleObjects);
      assert(
        (await getFile(`${cid}TEST`)).headers
          ?.get("content-type")
          ?.toString() === "image/jpeg",
        `${cid}`
      );
    });

    it("should throw an error when trying to upload two files with the same name", async () => {
      const sampleObjects: BufferOrStringWithName[] = [
        {
          data: readFileSync("test/files/test.mp4"),
          name: "test",
        },
        {
          data: readFileSync("test/files/bone.jpg"),
          name: "test",
        },
      ];
      try {
        await storage.uploadBatch(sampleObjects);
        assert.fail("should throw an error");
      } catch (e) {
        assert.equal(true, true);
      }
    });

    it("bulk upload", async () => {
      const sampleObjects: BufferOrStringWithName[] = [
        {
          data: readFileSync("test/files/test.mp4"),
          name: "test",
        },
        {
          data: readFileSync("test/files/bone.jpg"),
          name: "test",
        },
      ];
      try {
        await storage.uploadBatch(sampleObjects);
        assert.fail("should throw an error");
      } catch (e) {
        assert.equal(true, true);
      }
    });
  });
});
