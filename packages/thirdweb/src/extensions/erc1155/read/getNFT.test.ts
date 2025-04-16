import { describe, expect, it } from "vitest";

import { DROP1155_CONTRACT } from "~test/test-contracts.js";
import { getNFT } from "./getNFT.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc1155.getNFT", () => {
  it("without owner with indexer", async () => {
    const nft = await getNFT({
      contract: DROP1155_CONTRACT,
      tokenId: 2n,
    });
    expect(nft.metadata.name).toBe("Aura Platinum");
    // biome-ignore lint/suspicious/noExplicitAny: todo type this better
    expect((nft as any).supply).toBe(2519n);
  });

  it("without owner", async () => {
    const nft = await getNFT({
      contract: DROP1155_CONTRACT,
      tokenId: 2n,
      useIndexer: false,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "chainId": 1,
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
        "tokenAddress": "0x42d3641255C946CC451474295d29D3505173F22A",
        "tokenURI": "ipfs://QmbMXdbnNUAuGRoY6c6G792c6T9utfaBGqRUaMaRUf52Cb/2",
        "type": "ERC1155",
      }
    `);
  });
});
