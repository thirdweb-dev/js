import { beforeAll, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { getBatchesToReveal } from "./getBatchesToReveal.js";

const mocks = vi.hoisted(() => ({
  getBaseURICount: vi.fn(),
  getBatchIdAtIndex: vi.fn(),
  baseURIIndices: vi.fn(),
  tokenURI: vi.fn(),
  fetchTokenMetadata: vi.fn(),
  encryptedData: vi.fn(),
  decodeAbiParameters: vi.fn(),
}));

vi.mock(
  "../../__generated__/IBatchMintMetadata/read/getBaseURICount.js",
  () => ({
    getBaseURICount: mocks.getBaseURICount,
  }),
);

vi.mock(
  "../../__generated__/IBatchMintMetadata/read/getBatchIdAtIndex.js",
  () => ({
    getBatchIdAtIndex: mocks.getBatchIdAtIndex,
  }),
);

vi.mock("../../__generated__/IDrop/read/baseURIIndices.js", () => ({
  baseURIIndices: mocks.baseURIIndices,
}));

vi.mock("../../__generated__/IERC721A/read/tokenURI.js", () => ({
  tokenURI: mocks.tokenURI,
}));

vi.mock("../../../../utils/nft/fetchTokenMetadata.js", () => ({
  fetchTokenMetadata: mocks.fetchTokenMetadata,
}));

vi.mock("../../__generated__/IDelayedReveal/read/encryptedData.js", () => ({
  encryptedData: mocks.encryptedData,
}));

vi.mock("viem/utils", () => ({
  decodeAbiParameters: mocks.decodeAbiParameters,
}));

describe("getBatchesToReveal", () => {
  let contract: ThirdwebContract;

  beforeAll(() => {
    contract = getContract({
      chain: ANVIL_CHAIN,
      address: "0x708781BAE850faA490cB5b5b16b4687Ec0A8D65D",
      client: TEST_CLIENT,
    });
  });

  it("should return an empty array if no batches are available", async () => {
    mocks.getBaseURICount.mockResolvedValue(0n);

    const batches = await getBatchesToReveal({ contract });
    expect(batches).toEqual([]);
    expect(mocks.getBaseURICount).toHaveBeenCalledWith({ contract });
  });

  it("should return batches with metadata and encrypted URIs", async () => {
    mocks.getBaseURICount.mockResolvedValue(1n);
    mocks.getBatchIdAtIndex.mockResolvedValue(0n);
    mocks.tokenURI.mockResolvedValue("ipfs://placeholder_uri/");
    mocks.fetchTokenMetadata.mockResolvedValue({ name: "Test NFT" });
    mocks.encryptedData.mockResolvedValue("0xencrypteddata");
    mocks.decodeAbiParameters.mockReturnValue([
      "ipfs://encrypted_uri/",
      "hash",
    ]);

    const batches = await getBatchesToReveal({ contract });
    expect(batches).toEqual([
      {
        batchId: 0n,
        batchUri: "ipfs://encrypted_uri/",
        placeholderMetadata: { name: "Test NFT" },
      },
    ]);
  });
});
