import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Universal from "./index.js";

describe("Universal.routes", () => {
  it("should get routes", async () => {
    const routes = await Universal.routes({
      client: TEST_CLIENT,
    });

    expect(routes.slice(0, 5)).toMatchInlineSnapshot(`
      [
        {
          "destinationToken": {
            "address": "0x12c88a3C30A7AaBC1dd7f2c08a97145F5DCcD830",
            "chainId": 1,
            "decimals": 18,
            "iconUri": "https://assets.coingecko.com/coins/images/37207/standard/G.jpg",
            "name": "G7",
            "symbol": "G7",
          },
          "originToken": {
            "address": "0x7d8b6CEc10165119c4Ac7843a1e02184789585D8",
            "chainId": 33979,
            "decimals": 18,
            "iconUri": "https://assets.relay.link/icons/currencies/sipher.png",
            "name": "Sipher",
            "symbol": "SIPHER",
          },
        },
        {
          "destinationToken": {
            "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            "chainId": 1,
            "decimals": 8,
            "iconUri": "https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857",
            "name": "Wrapped BTC",
            "symbol": "WBTC",
          },
          "originToken": {
            "address": "0x7d8b6CEc10165119c4Ac7843a1e02184789585D8",
            "chainId": 33979,
            "decimals": 18,
            "iconUri": "https://assets.relay.link/icons/currencies/sipher.png",
            "name": "Sipher",
            "symbol": "SIPHER",
          },
        },
        {
          "destinationToken": {
            "address": "0x429F0d8233e517f9acf6F0C8293BF35804063a83",
            "chainId": 1,
            "decimals": 18,
            "iconUri": "https://assets.coingecko.com/coins/images/53319/standard/powerloom-200px.png",
            "name": "Powerloom Token",
            "symbol": "POWER",
          },
          "originToken": {
            "address": "0x7d8b6CEc10165119c4Ac7843a1e02184789585D8",
            "chainId": 33979,
            "decimals": 18,
            "iconUri": "https://assets.relay.link/icons/currencies/sipher.png",
            "name": "Sipher",
            "symbol": "SIPHER",
          },
        },
        {
          "destinationToken": {
            "address": "0x4C1746A800D224393fE2470C70A35717eD4eA5F1",
            "chainId": 1,
            "decimals": 18,
            "iconUri": "https://assets.coingecko.com/coins/images/53623/standard/plume-token.png?1736896935",
            "name": "PLUME",
            "symbol": "PLUME",
          },
          "originToken": {
            "address": "0x7d8b6CEc10165119c4Ac7843a1e02184789585D8",
            "chainId": 33979,
            "decimals": 18,
            "iconUri": "https://assets.relay.link/icons/currencies/sipher.png",
            "name": "Sipher",
            "symbol": "SIPHER",
          },
        },
        {
          "destinationToken": {
            "address": "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
            "chainId": 1,
            "decimals": 18,
            "iconUri": "https://coin-images.coingecko.com/coins/images/24383/large/apecoin.jpg?1696523566",
            "name": "ApeCoin",
            "symbol": "APE",
          },
          "originToken": {
            "address": "0x7d8b6CEc10165119c4Ac7843a1e02184789585D8",
            "chainId": 33979,
            "decimals": 18,
            "iconUri": "https://assets.relay.link/icons/currencies/sipher.png",
            "name": "Sipher",
            "symbol": "SIPHER",
          },
        },
      ]
    `);
  });
});
