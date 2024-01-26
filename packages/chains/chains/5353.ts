import type { Chain } from "../src/types";
export default {
  "chain": "TRITANIUM",
  "chainId": 5353,
  "explorers": [
    {
      "name": "TRITANIUM Testnet Explorer",
      "url": "https://testnet.tritanium.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmRm6gcEPJmU9a86zrmyP7FALTN4Toz9HrnrL2Kwg6FPeh",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.tritanium.network"
  ],
  "icon": {
    "url": "ipfs://QmRm6gcEPJmU9a86zrmyP7FALTN4Toz9HrnrL2Kwg6FPeh",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://tritanium.network",
  "name": "Tritanium Testnet",
  "nativeCurrency": {
    "name": "Tritanium Native Token",
    "symbol": "tTRN",
    "decimals": 18
  },
  "networkId": 5353,
  "rpc": [
    "https://tritanium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5353.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodetestnet-station-one.tritanium.network/",
    "https://nodetestnet-station-two.tritanium.network/"
  ],
  "shortName": "ttrn",
  "slip44": 1,
  "slug": "tritanium-testnet",
  "testnet": true
} as const satisfies Chain;