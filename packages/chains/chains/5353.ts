import type { Chain } from "../src/types";
export default {
  "chainId": 5353,
  "chain": "TRITANIUM",
  "name": "Tritanium Testnet",
  "rpc": [
    "https://tritanium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodetestnet-station-one.tritanium.network/",
    "https://nodetestnet-station-two.tritanium.network/"
  ],
  "slug": "tritanium-testnet",
  "icon": {
    "url": "ipfs://QmRm6gcEPJmU9a86zrmyP7FALTN4Toz9HrnrL2Kwg6FPeh",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.tritanium.network"
  ],
  "nativeCurrency": {
    "name": "Tritanium Native Token",
    "symbol": "tTRN",
    "decimals": 18
  },
  "infoURL": "https://tritanium.network",
  "shortName": "ttrn",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "TRITANIUM Testnet Explorer",
      "url": "https://testnet.tritanium.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;