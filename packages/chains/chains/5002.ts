import type { Chain } from "../src/types";
export default {
  "chain": "Treasurenet Mainnet Alpha",
  "chainId": 5002,
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.treasurenet.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
        "width": 1844,
        "height": 1920,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
    "width": 1844,
    "height": 1920,
    "format": "png"
  },
  "infoURL": "https://www.treasurenet.io",
  "name": "Treasurenet Mainnet Alpha",
  "nativeCurrency": {
    "name": "UNIT",
    "symbol": "UNIT",
    "decimals": 18
  },
  "networkId": 5002,
  "rpc": [
    "https://5002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.treasurenet.io",
    "https://node1.treasurenet.io",
    "https://node2.treasurenet.io",
    "https://node3.treasurenet.io"
  ],
  "shortName": "treasurenet",
  "slug": "treasurenet-alpha",
  "testnet": false
} as const satisfies Chain;