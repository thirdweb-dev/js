import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getNFT } from "./getNFT.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getNFT", () => {
  it("without owner using indexer", async () => {
    const nft = await getNFT({
      contract: DOODLES_CONTRACT,
      includeOwner: false,
      tokenId: 1n,
    });
    expect(nft.metadata.name).toBe("Doodle #1");
    expect(nft).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "image_url": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
          "uri": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        },
        "owner": null,
        "tokenAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });

  it("with owner using indexer", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      includeOwner: true,
      tokenId: 1n,
    });
    expect(nft.metadata.name).toBe("Doodle #1");
    expect(nft.owner).toBeDefined();
    expect(nft).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "image_url": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
          "uri": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        },
        "owner": "0x620b70123fB810F6C653DA7644b5dD0b6312e4D8",
        "tokenAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });

  it("without owner", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      includeOwner: false,
      tokenId: 1n,
      useIndexer: false,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
        },
        "owner": null,
        "tokenAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });

  it("with owner", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      includeOwner: true,
      tokenId: 1n,
      useIndexer: false,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
        },
        "owner": "0xbE9936FCFC50666f5425FDE4A9decC59cEF73b24",
        "tokenAddress": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });
});
