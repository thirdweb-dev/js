import type { Chain } from "../src/types";
export default {
  "chain": "TRITANIUM",
  "chainId": 5353,
  "explorers": [
    {
      "name": "TRITANIUM Testnet Explorer",
      "url": "https://testnet.tritanium.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.tritanium.network"
  ],
  "infoURL": "https://tritanium.network",
  "name": "Tritanium Testnet",
  "nativeCurrency": {
    "name": "Tritanium Native Token",
    "symbol": "tTRN",
    "decimals": 18
  },
  "networkId": 5353,
  "rpc": [
    "https://5353.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodetestnet-station-one.tritanium.network/",
    "https://nodetestnet-station-two.tritanium.network/"
  ],
  "shortName": "ttrn",
  "slip44": 1,
  "slug": "tritanium-testnet",
  "testnet": true
} as const satisfies Chain;