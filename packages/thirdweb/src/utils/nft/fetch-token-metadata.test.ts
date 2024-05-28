import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  type FetchTokenMetadataOptions,
  fetchTokenMetadata,
} from "./fetchTokenMetadata.js";

describe("fetchTokenMetadata", () => {
  it("should return a json object from a valid base64 encoded json", async () => {
    const validJson = { foo: "bar" };
    const validBase64Json = `data:application/json;base64,${btoa(
      JSON.stringify(validJson),
    )}`;

    const options: FetchTokenMetadataOptions = {
      client: TEST_CLIENT,
      tokenId: 0n,
      tokenUri: validBase64Json,
    };
    const result = await fetchTokenMetadata(options);
    expect(result).toEqual(validJson);
  });

  it("should throw an error for INVALID base64 encoded json", async () => {
    // { "foo": "bar"
    const invalidBase64Json =
      "data:application/json;base64,eyJmb28iOiAiYmFyIg==";

    const options: FetchTokenMetadataOptions = {
      client: TEST_CLIENT,
      tokenId: 0n,
      tokenUri: invalidBase64Json,
    };
    await expect(() => fetchTokenMetadata(options)).rejects.toThrowError();
  });
});
