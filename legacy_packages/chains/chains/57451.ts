import type { Chain } from "../src/types";
export default {
  "chain": "coinsecnetwork",
  "chainId": 57451,
  "explorers": [
    {
      "name": "coinsecnetwork",
      "url": "https://explorer.coinsec.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeUyBe58BPndt6SpH9Tn1a8AYpNtHbMVhVyZt8Ppc4HTB",
    "width": 200,
    "height": 200,
    "format": "svg"
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