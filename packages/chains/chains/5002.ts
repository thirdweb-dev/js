import type { Chain } from "../src/types";
export default {
  "name": "Treasurenet Mainnet Alpha",
  "chain": "Treasurenet Mainnet Alpha",
  "icon": {
    "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
    "width": 1844,
    "height": 1920,
    "format": "png"
  },
  "rpc": [
    "https://treasurenet-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.treasurenet.io",
    "https://node1.treasurenet.io",
    "https://node2.treasurenet.io",
    "https://node3.treasurenet.io"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "UNIT",
    "symbol": "UNIT",
    "decimals": 18
  },
  "infoURL": "https://www.treasurenet.io",
  "shortName": "treasurenet",
  "chainId": 5002,
  "networkId": 5002,
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.treasurenet.io",
      "icon": {
        "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
        "width": 1844,
        "height": 1920,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "treasurenet-alpha"
} as const satisfies Chain;