import type { Chain } from "../src/types";
export default {
  "chain": "Habitat",
  "chainId": 1123,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.bsquared.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPV6ASrQDEkEW3g3ni7p2rJMPeciRLpEpvrAc1QfzVkx9",
        "width": 640,
        "height": 640,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPV6ASrQDEkEW3g3ni7p2rJMPeciRLpEpvrAc1QfzVkx9",
    "width": 640,
    "height": 640,
    "format": "png"
  },
  "infoURL": "https://www.bsquared.network",
  "name": "B2 Testnet",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 1123,
  "parent": {
    "type": "L2",
    "chain": "eip155-1113"
  },
  "rpc": [
    "https://1123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://b2-testnet.alt.technology",
    "https://rpc.ankr.com/b2_testnet",
    "https://testnet-rpc.bsquared.network"
  ],
  "shortName": "B2-testnet",
  "slug": "b2-testnet",
  "testnet": true,
  "title": "B2 Testnet"
} as const satisfies Chain;