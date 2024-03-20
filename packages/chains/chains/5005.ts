import type { Chain } from "../src/types";
export default {
  "chain": "Treasurenet Testnet",
  "chainId": 5005,
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.testnet.treasurenet.io",
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
  "infoURL": "https://www.testnet.treasurenet.io",
  "name": "Treasurenet Testnet",
  "nativeCurrency": {
    "name": "UNIT",
    "symbol": "UNIT",
    "decimals": 18
  },
  "networkId": 5005,
  "rpc": [
    "https://5005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.testnet.treasurenet.io",
    "https://node1.testnet.treasurenet.io",
    "https://node2.testnet.treasurenet.io",
    "https://node3.testnet.treasurenet.io"
  ],
  "shortName": "tntest",
  "slip44": 1,
  "slug": "treasurenet-testnet",
  "testnet": true
} as const satisfies Chain;