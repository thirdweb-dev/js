import type { Chain } from "../src/types";
export default {
  "name": "Joseon Mainnet",
  "chain": "Joseon",
  "icon": {
    "url": "ipfs://QmQjwcNRCLXU8JBtSkPLUnbWVrpoqbnZVffpJ9Bu8rG34e",
    "width": 148,
    "height": 148,
    "format": "svg"
  },
  "rpc": [
    "https://joseon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.modchain.net/blockchain.joseon.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Joseon Mun",
    "symbol": "JSM",
    "decimals": 18
  },
  "infoURL": "https://www.joseon.com/",
  "shortName": "mun",
  "chainId": 1392,
  "networkId": 1392,
  "explorers": [
    {
      "name": "BlockExplorer",
      "url": "https://www.blockexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "joseon"
} as const satisfies Chain;