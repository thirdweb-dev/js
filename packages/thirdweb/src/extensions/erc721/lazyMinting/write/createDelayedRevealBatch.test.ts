import { beforeAll, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { createDelayedRevealBatch } from "./createDelayedRevealBatch.js";

const mocks = vi.hoisted(() => ({
  getBaseUriFromBatch: vi.fn(),
  getBaseURICount: vi.fn(),
  encryptDecrypt: vi.fn(),
  lazyMint: vi.fn(),
  upload: vi.fn(),
}));

vi.mock("../../../../utils/ipfs.js", () => ({
  getBaseUriFromBatch: mocks.getBaseUriFromBatch,
}));

vi.mock(
  "../../__generated__/IBatchMintMetadata/read/getBaseURICount.js",
  () => ({
    getBaseURICount: mocks.getBaseURICount,
  }),
);

vi.mock("../../__generated__/IDelayedReveal/read/encryptDecrypt.js", () => ({
  encryptDecrypt: mocks.encryptDecrypt,
}));

vi.mock("../../../../storage/upload.js", () => ({
  upload: mocks.upload,
}));

const placeholderNFT = {
  name: "Hidden NFT",
  description: "Will be revealed next week!",
};

const realNFTs = [
  {
    name: "Common NFT #1",
    description: "Common NFT, one of many.",
  },
  {
    name: "Super Rare NFT #2",
    description: "You got a Super Rare NFT!",
  },
];

describe("createDelayedRevealedBatch", () => {
  let contract: ThirdwebContract;
  beforeAll(() => {
    vi.clearAllMocks();
    contract = getContract({
      chain: ANVIL_CHAIN,
      address: "0x708781BAE850faA490cB5b5b16b4687Ec0A8D65D",
      client: TEST_CLIENT,
    });
  });

  it("should generate the proper calldata", async () => {
    mocks.getBaseUriFromBatch
      .mockReturnValueOnce(
        "ipfs://QmQbqDu4aT7sMJHNUk76s4F6DgGk2hVYXYSqpsTRoRM5G8/",
      )
      .mockReturnValueOnce(
        "ipfs://QmRhASFGXNRE3NXNTfakz82j4Tmv5A9rBezTKGZ5DL6uip/",
      );
    mocks.getBaseURICount.mockResolvedValue(0n);
    mocks.encryptDecrypt.mockResolvedValue(
      "0x8967ae24bd1c6439791bc1c8ca3b3499537283b71af366693792a707eb99e80bc0058c90c1f92f18ec716e4760fdf9279241d442b5b5",
    );

    const tx = createDelayedRevealBatch({
      contract,
      placeholderMetadata: placeholderNFT,
      metadata: realNFTs,
      password: "password123",
    });

    let data: Hex;
    if (typeof tx.data === "string") {
      data = tx.data;
    } else {
      data = (await tx.data?.()) || "0x";
    }

    expect(data).toEqual(
      "0xd37c353b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000036697066733a2f2f516d516271447534615437734d4a484e556b3736733446364467476b3268565958595371707354526f524d3547382f0000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040963325533d81f66ae93aff4f562735814e51020ea8bf2bd48eb983ae88cbc40b00000000000000000000000000000000000000000000000000000000000000368967ae24bd1c6439791bc1c8ca3b3499537283b71af366693792a707eb99e80bc0058c90c1f92f18ec716e4760fdf9279241d442b5b500000000000000000000",
    );
    expect(mocks.upload).toHaveBeenCalledTimes(2);
  });
});
