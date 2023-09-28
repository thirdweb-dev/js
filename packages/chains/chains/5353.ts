import type { Chain } from "../src/types";
export default {
  "name": "Tritanium Testnet",
  "chain": "TRITANIUM",
  "rpc": [
    "https://tritanium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodetestnet-station-one.tritanium.network/",
    "https://nodetestnet-station-two.tritanium.network/"
  ],
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
  "chainId": 5353,
  "networkId": 5353,
  "icon": {
    "url": "ipfs://QmRm6gcEPJmU9a86zrmyP7FALTN4Toz9HrnrL2Kwg6FPeh",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "TRITANIUM Testnet Explorer",
      "icon": {
        "url": "ipfs://QmRm6gcEPJmU9a86zrmyP7FALTN4Toz9HrnrL2Kwg6FPeh",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "url": "https://testnet.tritanium.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "tritanium-testnet"
} as const satisfies Chain;