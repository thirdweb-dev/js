import type { Chain } from "../src/types";
export default {
  "chainId": 1392,
  "chain": "Joseon",
  "name": "Joseon Mainnet",
  "rpc": [
    "https://joseon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.modchain.net/blockchain.joseon.com/rpc"
  ],
  "slug": "joseon",
  "icon": {
    "url": "ipfs://QmQjwcNRCLXU8JBtSkPLUnbWVrpoqbnZVffpJ9Bu8rG34e",
    "width": 148,
    "height": 148,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Joseon Mun",
    "symbol": "JSM",
    "decimals": 18
  },
  "infoURL": "https://www.joseon.com/",
  "shortName": "mun",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BlockExplorer",
      "url": "https://www.blockexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;