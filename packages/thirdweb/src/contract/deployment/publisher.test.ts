import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { fetchPublishedContractMetadata } from "./publisher.js";

vi.mock("../../contract");
vi.mock("../../../transaction/read-contract");
vi.mock("../../../storage/download");

// TODO: Add mocks to these tests instead of using live data
describe.runIf(process.env.TW_SECRET_KEY)("fetchPublishedContract", () => {
  it("fetches the latest published contract when no version is specified", async () => {
    const result = await fetchPublishedContractMetadata({
      publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      contractId: "Counter",
      client: TEST_CLIENT,
    });

    expect(result.extendedMetadata?.version).toEqual("1.0.2");
  });

  it("fetches a specific version when specified", async () => {
    const result = await fetchPublishedContractMetadata({
      publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      contractId: "Counter",
      client: TEST_CLIENT,
      version: "1.0.1",
    });

    expect(result.extendedMetadata?.version).toEqual("1.0.1");
  });

  it("throws an error when an invalid version is specified", async () => {
    const result = fetchPublishedContractMetadata({
      publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      contractId: "Counter",
      client: TEST_CLIENT,
      version: "1.2.3",
    });

    await expect(result).rejects.toThrow("Contract version not found");
  });
});
