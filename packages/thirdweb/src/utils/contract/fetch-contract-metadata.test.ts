import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  type FetchContractMetadata,
  fetchContractMetadata,
} from "./fetchContractMetadata.js";

describe("fetchContractMetadata", () => {
  it("should return a json object from a valid base64 encoded json", async () => {
    const validContractMetadata = {
      name: "contract name",
      description: "contract description",
    };
    const contractURIBase64 = `data:application/json;base64,${btoa(
      JSON.stringify(validContractMetadata),
    )}`;
    const options: FetchContractMetadata = {
      client: TEST_CLIENT,
      uri: contractURIBase64,
    };
    const result = await fetchContractMetadata(options);
    expect(result).toEqual(validContractMetadata);
  });

  it("should return `undefined` for INVALID base64 encoded json", async () => {
    // { "foo": "bar"
    const invalidBase64Json =
      "data:application/json;base64,eyJmb28iOiAiYmFyIg==";

    const options: FetchContractMetadata = {
      client: TEST_CLIENT,
      uri: invalidBase64Json,
    };
    const result = await fetchContractMetadata(options);
    expect(result).toEqual(undefined);
  });
});
