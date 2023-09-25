import type { Chain } from "../src/types";
export default {
  "chainId": 5005,
  "chain": "Treasurenet Testnet",
  "name": "Treasurenet Testnet",
  "rpc": [
    "https://treasurenet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.testnet.treasurenet.io",
    "https://node1.testnet.treasurenet.io",
    "https://node2.testnet.treasurenet.io",
    "https://node3.testnet.treasurenet.io"
  ],
  "slug": "treasurenet-testnet",
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
  "infoURL": "https://www.testnet.treasurenet.io",
  "shortName": "tntest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.testnet.treasurenet.io",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;