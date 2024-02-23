import { describe, it, expect, vi, afterEach } from "vitest";

import { getNFT } from "./getNFT.js";
import { DROP1155_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc1155.getNFT", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it.runIf(process.env.TW_SECRET_KEY)("without owner", async () => {
    const nft = await getNFT({
      contract: DROP1155_CONTRACT,
      tokenId: 2n,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "id": 2n,
        "metadata": {
          "animation_url": "ipfs://QmYoM63qaumQznBRx38tQjkY4ewbymeFb2KWBhkfMqNHax/3.mp4",
          "attributes": [
            {
              "trait_type": "Revenue Share",
              "value": "15%",
            },
            {
              "trait_type": "Max Supply",
              "value": "5000",
            },
            {
              "trait_type": "Max Per Wallet",
              "value": "10",
            },
          ],
          "background_color": "",
          "description": "",
          "external_url": "https://auraexchange.org",
          "image": "ipfs://QmYoM63qaumQznBRx38tQjkY4ewbymeFb2KWBhkfMqNHax/2.png",
          "name": "Aura Platinum",
        },
        "owner": null,
        "supply": 2519n,
        "tokenURI": "ipfs://QmbMXdbnNUAuGRoY6c6G792c6T9utfaBGqRUaMaRUf52Cb/2",
        "type": "ERC1155",
      }
    `);
    // 2 fetch calls: 1 for RPC, 1 for fetching the tokenUri
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
