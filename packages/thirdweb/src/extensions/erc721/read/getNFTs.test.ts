import { describe, it, expect, vi, afterEach } from "vitest";

import { getNFTs } from "./getNFTs.js";
import { AZUKI_CONTRACT, DOODLES_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getNFTs", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("works for azuki", async () => {
    const nfts = await getNFTs({
      contract: AZUKI_CONTRACT,
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
                "trait_type": "Type",
                "value": "Human",
              },
              {
                "trait_type": "Hair",
                "value": "Water",
              },
              {
                "trait_type": "Clothing",
                "value": "Pink Oversized Kimono",
              },
              {
                "trait_type": "Eyes",
                "value": "Striking",
              },
              {
                "trait_type": "Mouth",
                "value": "Frown",
              },
              {
                "trait_type": "Offhand",
                "value": "Monkey King Staff",
              },
              {
                "trait_type": "Background",
                "value": "Off White A",
              },
            ],
            "image": "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/0.png",
            "name": "Azuki #0",
          },
          "owner": null,
          "tokenURI": "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/0",
          "type": "ERC721",
        },
        {
          "id": 1n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Type",
                "value": "Human",
              },
              {
                "trait_type": "Hair",
                "value": "Pink Hairband",
              },
              {
                "trait_type": "Clothing",
                "value": "White Qipao with Fur",
              },
              {
                "trait_type": "Eyes",
                "value": "Daydreaming",
              },
              {
                "trait_type": "Mouth",
                "value": "Lipstick",
              },
              {
                "trait_type": "Offhand",
                "value": "Gloves",
              },
              {
                "trait_type": "Background",
                "value": "Off White D",
              },
            ],
            "image": "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png",
            "name": "Azuki #1",
          },
          "owner": null,
          "tokenURI": "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/1",
          "type": "ERC721",
        },
        {
          "id": 2n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Type",
                "value": "Human",
              },
              {
                "trait_type": "Hair",
                "value": "Pink Flowy",
              },
              {
                "trait_type": "Ear",
                "value": "Red Tassel",
              },
              {
                "trait_type": "Clothing",
                "value": "Vest",
              },
              {
                "trait_type": "Eyes",
                "value": "Ruby",
              },
              {
                "trait_type": "Mouth",
                "value": "Chewing",
              },
              {
                "trait_type": "Background",
                "value": "Red",
              },
            ],
            "image": "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2.png",
            "name": "Azuki #2",
          },
          "owner": null,
          "tokenURI": "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/2",
          "type": "ERC721",
        },
        {
          "id": 3n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Type",
                "value": "Human",
              },
              {
                "trait_type": "Hair",
                "value": "Green Spiky",
              },
              {
                "trait_type": "Headgear",
                "value": "Frog Headband",
              },
              {
                "trait_type": "Neck",
                "value": "Frog Headphones",
              },
              {
                "trait_type": "Clothing",
                "value": "Green Yukata",
              },
              {
                "trait_type": "Eyes",
                "value": "Careless",
              },
              {
                "trait_type": "Mouth",
                "value": "Grass",
              },
              {
                "trait_type": "Offhand",
                "value": "Katana",
              },
              {
                "trait_type": "Background",
                "value": "Red",
              },
            ],
            "image": "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/3.png",
            "name": "Azuki #3",
          },
          "owner": null,
          "tokenURI": "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/3",
          "type": "ERC721",
        },
        {
          "id": 4n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Type",
                "value": "Human",
              },
              {
                "trait_type": "Hair",
                "value": "Brown Dreadlocks",
              },
              {
                "trait_type": "Clothing",
                "value": "White Qipao with Fur",
              },
              {
                "trait_type": "Eyes",
                "value": "Lightning",
              },
              {
                "trait_type": "Mouth",
                "value": "Smirk",
              },
              {
                "trait_type": "Offhand",
                "value": "Katana",
              },
              {
                "trait_type": "Background",
                "value": "Off White D",
              },
            ],
            "image": "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/4.png",
            "name": "Azuki #4",
          },
          "owner": null,
          "tokenURI": "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/4",
          "type": "ERC721",
        },
      ]
    `);
  });

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

  it("works for a contract with `1` indexed NFTs", async () => {
    const nfts = await getNFTs({
      contract: {
        ...DOODLES_CONTRACT,
        address: "0x5D62Fb8dcD9b480960f55956fBDD8D9F07f2B402",
      },
      count: 5,
    });

    expect(nfts.length).toBe(5);
    expect(nfts).toMatchInlineSnapshot(`
      [
        {
          "id": 0n,
          "metadata": {
            "id": 0n,
            "type": "ERC721",
            "uri": "",
          },
          "owner": null,
          "tokenURI": "",
          "type": "ERC721",
        },
        {
          "id": 1n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Background",
                "value": "Milky Way",
              },
              {
                "trait_type": "Body",
                "value": "Pyro",
              },
              {
                "trait_type": "Head",
                "value": "Match-Fire",
              },
              {
                "trait_type": "Face",
                "value": "Spite",
              },
              {
                "trait_type": "Cloth",
                "value": "Windbreaker-White",
              },
              {
                "trait_type": "Fire",
                "value": "V-Flame",
              },
            ],
            "description": "Enter into a world full of rebels",
            "image": "ipfs://bafybeigyyqe47wqitc7lczextz5epf5rx52iq4uw6fwavcys7uv7nv5uli/1.png",
            "name": "MISTFITS #1",
          },
          "owner": null,
          "tokenURI": "ipfs://bafybeid3jgxafevtfxw5gmlxrvftxddkmjnzfq4o6jfgzqdq7zyi5qz6cm/1.json",
          "type": "ERC721",
        },
        {
          "id": 2n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Background",
                "value": "Orange",
              },
              {
                "trait_type": "Body",
                "value": "Sora",
              },
              {
                "trait_type": "Head",
                "value": "Air-Mass",
              },
              {
                "trait_type": "Face",
                "value": "Surrender",
              },
              {
                "trait_type": "Cloth",
                "value": "Sifu yip",
              },
            ],
            "description": "Enter into a world full of rebels",
            "image": "ipfs://bafybeigyyqe47wqitc7lczextz5epf5rx52iq4uw6fwavcys7uv7nv5uli/2.png",
            "name": "MISTFITS #2",
          },
          "owner": null,
          "tokenURI": "ipfs://bafybeid3jgxafevtfxw5gmlxrvftxddkmjnzfq4o6jfgzqdq7zyi5qz6cm/2.json",
          "type": "ERC721",
        },
        {
          "id": 3n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Background",
                "value": "Yellow",
              },
              {
                "trait_type": "Body",
                "value": "Cyan",
              },
              {
                "trait_type": "Tattoo",
                "value": "Votary",
              },
              {
                "trait_type": "Eye",
                "value": "Fury",
              },
              {
                "trait_type": "Cloth",
                "value": "Chef-Black",
              },
              {
                "trait_type": "Head",
                "value": "Round Hat-Black",
              },
              {
                "trait_type": "Hand",
                "value": "Puppet",
              },
            ],
            "description": "Enter into a world full of rebels",
            "image": "ipfs://bafybeigyyqe47wqitc7lczextz5epf5rx52iq4uw6fwavcys7uv7nv5uli/3.png",
            "name": "MISTFITS #3",
          },
          "owner": null,
          "tokenURI": "ipfs://bafybeid3jgxafevtfxw5gmlxrvftxddkmjnzfq4o6jfgzqdq7zyi5qz6cm/3.json",
          "type": "ERC721",
        },
        {
          "id": 4n,
          "metadata": {
            "attributes": [
              {
                "trait_type": "Background",
                "value": "Purple",
              },
              {
                "trait_type": "Body",
                "value": "Warm",
              },
              {
                "trait_type": "Tattoo",
                "value": "Hunting",
              },
              {
                "trait_type": "Eye",
                "value": "Endurance",
              },
              {
                "trait_type": "Cloth",
                "value": "Purple down undershirt",
              },
              {
                "trait_type": "Head",
                "value": "Beanie-White",
              },
              {
                "trait_type": "Hand",
                "value": "Sound",
              },
            ],
            "description": "Enter into a world full of rebels",
            "image": "ipfs://bafybeigyyqe47wqitc7lczextz5epf5rx52iq4uw6fwavcys7uv7nv5uli/4.png",
            "name": "MISTFITS #4",
          },
          "owner": null,
          "tokenURI": "ipfs://bafybeid3jgxafevtfxw5gmlxrvftxddkmjnzfq4o6jfgzqdq7zyi5qz6cm/4.json",
          "type": "ERC721",
        },
      ]
    `);
  });
});
