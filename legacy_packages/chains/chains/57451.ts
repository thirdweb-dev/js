import type { Chain } from "../src/types";
export default {
  "chain": "coinsecnetwork",
  "chainId": 57451,
  "explorers": [
    {
      "name": "coinsec network",
      "url": "https://explorer.coinsec.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWm9biSavZ4ixNNSe8KhxiYgYaejY6Y4xRaqmz9fXimo5",
    "width": 1136,
    "height": 1112,
    "format": "png"
  },
  "infoURL": "https://explorer.coinsec.network/",
  "name": "COINSEC",
  "nativeCurrency": {
    "name": "COINSEC",
    "symbol": "SEC",
    "decimals": 18
  },
  "networkId": 57451,
  "rpc": [
    "https://57451.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.coinsec.network"
  ],
  "shortName": "coinsecnetwork",
  "slug": "coinsec",
  "testnet": false,
  "title": "COINSEC Network"
} as const satisfies Chain;