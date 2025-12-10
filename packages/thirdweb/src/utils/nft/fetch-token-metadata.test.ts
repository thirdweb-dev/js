import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { stringify } from "../json.js";
import {
  type FetchTokenMetadataOptions,
  fetchTokenMetadata,
} from "./fetchTokenMetadata.js";

describe("fetchTokenMetadata", () => {
  it("should return a json object from a valid base64 encoded json", async () => {
    const validJson = { foo: "bar" };
    const validBase64Json = `data:application/json;base64,${btoa(
      stringify(validJson),
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
    await expect(fetchTokenMetadata(options)).rejects.toThrowError();
  });

  it("should return a json object from a valid UTF-8 encoded json", async () => {
    const validJson = { name: "NFT Name", description: "NFT Description" };
    const validUtf8Json = `data:application/json;utf-8,${stringify(validJson)}`;

    const options: FetchTokenMetadataOptions = {
      client: TEST_CLIENT,
      tokenId: 1n,
      tokenUri: validUtf8Json,
    };
    const result = await fetchTokenMetadata(options);
    expect(result).toEqual(validJson);
  });

  it("should return a json object from UTF-8 encoded json with unicode characters", async () => {
    const validJson = { name: "🎉 NFT", emoji: "🚀", text: "Hello World" };
    const validUtf8Json = `data:application/json;utf-8,${stringify(validJson)}`;

    const options: FetchTokenMetadataOptions = {
      client: TEST_CLIENT,
      tokenId: 2n,
      tokenUri: validUtf8Json,
    };
    const result = await fetchTokenMetadata(options);
    expect(result).toEqual(validJson);
  });

  it("should throw an error for INVALID UTF-8 encoded json", async () => {
    // Malformed JSON: { "foo": "bar" (missing closing brace)
    const invalidUtf8Json = 'data:application/json;utf-8,{"foo": "bar"';

    const options: FetchTokenMetadataOptions = {
      client: TEST_CLIENT,
      tokenId: 3n,
      tokenUri: invalidUtf8Json,
    };
    await expect(fetchTokenMetadata(options)).rejects.toThrowError();
  });
});
