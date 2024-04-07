import { describe, expect, it } from "vitest";

import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getNFTs } from "./getNFTs.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getNFTs", () => {
  it("works for a contract with 0 indexed NFTs", async () => {
    const nfts = await getNFTs({
      contract: DOODLES_CONTRACT,
      count: 5,
    });

    expect(nfts.length).toBe(5);
    expect(nfts).toMatchInlineSnapshot(`
      [
        {
          "id": 0n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "face",
                "value": "mustache",
              },
              {
                "trait_type": "hair",
                "value": "purple long",
              },
              {
                "trait_type": "body",
                "value": "blue and yellow jacket",
              },
              {
                "trait_type": "background",
                "value": "green",
              },
              {
                "trait_type": "head",
                "value": "tan",
              },
            ],
            "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
            "image": "ipfs://QmUEfFfwAh4wyB5UfHCVPUxis4j4Q4kJXtm5x5p3g1fVUn",
            "name": "Doodle #0",
          },
          "owner": null,
          "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/0",
          "type": "ERC721",
        },
        {
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
          "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
          "type": "ERC721",
        },
        {
          "id": 2n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "face",
                "value": "designer glasses",
              },
              {
                "trait_type": "hair",
                "value": "poopie",
              },
              {
                "trait_type": "body",
                "value": "blue fleece",
              },
              {
                "trait_type": "background",
                "value": "yellow",
              },
              {
                "trait_type": "head",
                "value": "purple",
              },
            ],
            "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
            "image": "ipfs://QmbvZ2hbF3nEq5r3ijMEiSGssAmJvtyFwiejTAGHv74LR5",
            "name": "Doodle #2",
          },
          "owner": null,
          "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/2",
          "type": "ERC721",
        },
        {
          "id": 3n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "face",
                "value": "designer glasses",
              },
              {
                "trait_type": "hair",
                "value": "holographic mohawk",
              },
              {
                "trait_type": "body",
                "value": "pink fleece",
              },
              {
                "trait_type": "background",
                "value": "gradient 1",
              },
              {
                "trait_type": "head",
                "value": "pale",
              },
            ],
            "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
            "image": "ipfs://QmVpwaCqLut3wqwB5KSQr2fGnbLuJt5e3LhNvzvcisewZB",
            "name": "Doodle #3",
          },
          "owner": null,
          "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/3",
          "type": "ERC721",
        },
        {
          "id": 4n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "face",
                "value": "happy",
              },
              {
                "trait_type": "hair",
                "value": "purple long",
              },
              {
                "trait_type": "body",
                "value": "spotted hoodie",
              },
              {
                "trait_type": "background",
                "value": "gradient 2",
              },
              {
                "trait_type": "head",
                "value": "purple",
              },
            ],
            "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
            "image": "ipfs://QmcyuFVLbfBmSeQ9ynu4dk67r97nB1abEekotuVuRGWedm",
            "name": "Doodle #4",
          },
          "owner": null,
          "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/4",
          "type": "ERC721",
        },
      ]
    `);
  });

  it.todo("works for a contract with `1` indexed NFTs", async () => {
    // TODO find a contract that we can use that has "1 indexed" NFTs, then re-enable this test
  });
});
