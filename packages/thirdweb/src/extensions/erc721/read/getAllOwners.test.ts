import { describe, expect, it } from "vitest";

import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getAllOwners } from "./getAllOwners.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getAllOwners", () => {
  it("works for a contract with 0 indexed NFTs", async () => {
    const nfts = await getAllOwners({
      contract: DOODLES_CONTRACT,
      count: 5,
    });

    expect(nfts.length).toBe(5);
    expect(nfts).toMatchInlineSnapshot(`
      [
        {
          "owner": "0x3010775D16E7B79AF280035c64a1Df5F705CfdDb",
          "tokenId": 0n,
        },
        {
          "owner": "0xbE9936FCFC50666f5425FDE4A9decC59cEF73b24",
          "tokenId": 1n,
        },
        {
          "owner": "0x66Db2F6fDEb4d597B63f52dA5Be9D645906f13f3",
          "tokenId": 2n,
        },
        {
          "owner": "0x4947DA4bEF9D79bc84bD584E6c12BfFa32D1bEc8",
          "tokenId": 3n,
        },
        {
          "owner": "0xAb9F4D19F6F22B152153A1d701A1492255d79387",
          "tokenId": 4n,
        },
      ]
    `);
  });

  it.todo("works for a contract with `1` indexed NFTs", async () => {
    // TODO - find a contract with `1` indexed NFTs to test
  });
});
