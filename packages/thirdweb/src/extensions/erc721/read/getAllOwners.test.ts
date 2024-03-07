import { describe, it, expect, vi, afterEach } from "vitest";

import { getAllOwners } from "./getAllOwners.js";
import { AZUKI_CONTRACT, DOODLES_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getAllOwners", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("works for azuki", async () => {
    const nfts = await getAllOwners({
      contract: AZUKI_CONTRACT,
      count: 5,
    });

    expect(nfts.length).toBe(5);
    expect(nfts).toMatchInlineSnapshot(`
      [
        {
          "owner": "0x2aE6B0630EBb4D155C6e04fCB16840FFA77760AA",
          "tokenId": 0n,
        },
        {
          "owner": "0xC8967D1537F7B995607A1DEa2B0C06E18A9756a2",
          "tokenId": 1n,
        },
        {
          "owner": "0x9D7526b3A7721E1A1E204b0e79E2938e0F095aE5",
          "tokenId": 2n,
        },
        {
          "owner": "0x8Fae7DEFf5A9296bDfc99b559C90dc8Ec90C22eA",
          "tokenId": 3n,
        },
        {
          "owner": "0x2aE6B0630EBb4D155C6e04fCB16840FFA77760AA",
          "tokenId": 4n,
        },
      ]
    `);
  });

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

  it("works for a contract with `1` indexed NFTs", async () => {
    const nfts = await getAllOwners({
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
          "owner": "0x0000000000000000000000000000000000000000",
          "tokenId": 0n,
        },
        {
          "owner": "0xc85982220Cb499E4075df0c04f617E047F2d430A",
          "tokenId": 1n,
        },
        {
          "owner": "0xca7510f2F00EC3e2B3e577a20D46195A8830d429",
          "tokenId": 2n,
        },
        {
          "owner": "0x92B2118EAb973F023933a91E8B7DE18e068341F8",
          "tokenId": 3n,
        },
        {
          "owner": "0x84e2f0dee1Ec3239c715B34025dCcDD6F823333B",
          "tokenId": 4n,
        },
      ]
    `);
  });
});
