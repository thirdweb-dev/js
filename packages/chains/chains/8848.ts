import type { Chain } from "../src/types";
export default {
  "chain": "MARO Blockchain",
  "chainId": 8848,
  "explorers": [
    {
      "name": "MARO Scan",
      "url": "https://scan.ma.ro/#",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreig47k53aipns6nu3u5fxpysp7mogzk6zyvatgpbam7yut3yvtuefa",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "infoURL": "https://ma.ro/",
  "name": "MARO Blockchain Mainnet",
  "nativeCurrency": {
    "name": "MARO",
    "symbol": "MARO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://maro-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.ma.ro"
  ],
  "shortName": "maro",
  "slug": "maro-blockchain",
  "testnet": false
} as const satisfies Chain;