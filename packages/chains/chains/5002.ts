import type { Chain } from "../src/types";
export default {
  "chainId": 5002,
  "chain": "Treasurenet Mainnet Alpha",
  "name": "Treasurenet Mainnet Alpha",
  "rpc": [
    "https://treasurenet-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.treasurenet.io",
    "https://node1.treasurenet.io",
    "https://node2.treasurenet.io",
    "https://node3.treasurenet.io"
  ],
  "slug": "treasurenet-alpha",
  "icon": {
    "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
    "width": 1844,
    "height": 1920,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "UNIT",
    "symbol": "UNIT",
    "decimals": 18
  },
  "infoURL": "https://www.treasurenet.io",
  "shortName": "treasurenet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.treasurenet.io",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;