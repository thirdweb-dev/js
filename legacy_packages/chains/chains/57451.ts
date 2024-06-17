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
    "url": "ipfs://QmYV6beVVg3iS9RGPno7GAASpgjyBDoKmWGUcvAKe2nXWK",
    "width": 50,
    "height": 50,
    "format": "png"
  },
  "infoURL": "https://explorer.coinsec.network/",
  "name": "COINSEC Network",
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
  "slug": "coinsec-network",
  "testnet": false,
  "title": "COINSEC Network"
} as const satisfies Chain;