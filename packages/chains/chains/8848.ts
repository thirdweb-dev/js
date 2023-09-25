import type { Chain } from "../src/types";
export default {
  "chainId": 8848,
  "chain": "MARO Blockchain",
  "name": "MARO Blockchain Mainnet",
  "rpc": [
    "https://maro-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.ma.ro"
  ],
  "slug": "maro-blockchain",
  "icon": {
    "url": "ipfs://bafkreig47k53aipns6nu3u5fxpysp7mogzk6zyvatgpbam7yut3yvtuefa",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MARO",
    "symbol": "MARO",
    "decimals": 18
  },
  "infoURL": "https://ma.ro/",
  "shortName": "maro",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MARO Scan",
      "url": "https://scan.ma.ro/#",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;