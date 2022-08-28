import { assert } from "chai";
import { IpfsStorage } from "@thirdweb-dev/storage";

const ipfsGatewayUrl = "https://ipfs.thirdweb.com/ipfs/";
const storage = new IpfsStorage(ipfsGatewayUrl);

describe("Recursive Testing", async () => {
  let json: Record<string, any>;
  beforeEach(async () => {
    json = {
      test: "test",
      test2: "ipfs://QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
      test3: {
        test: "test",
        test2: "ipfs://QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
        test3: {
          test: "test",
          test2: "ipfs://QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
        },
      },
    };
  });
  it("should resolve all URLs", async () => {
    const uri = await storage.uploadMetadata(json);
    const jsonOutput = await storage.get(uri);
    assert.notStrictEqual(jsonOutput, {
      test2:
        "https://ipfs.thirdweb.com/ipfs/QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
      test3: {
        test: "test",
        test2:
          "https://ipfs.thirdweb.com/ipfs/QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
        test3: {
          test: "test",
          test2:
            "https://ipfs.thirdweb.com/ipfs/QmTJyQwBhbELaceUScbM29G3HRpk4GdKXMuVxAxGCGtXME",
        },
      },
    });
  });
});
