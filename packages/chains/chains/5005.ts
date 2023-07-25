import type { Chain } from "../src/types";
export default {
  "name": "Treasurenet Testnet",
  "chain": "Treasurenet Testnet",
  "icon": {
    "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
    "width": 1844,
    "height": 1920,
    "format": "png"
  },
  "rpc": [
    "https://treasurenet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node0.testnet.treasurenet.io",
    "https://node1.testnet.treasurenet.io",
    "https://node2.testnet.treasurenet.io",
    "https://node3.testnet.treasurenet.io"
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
  "infoURL": "https://www.testnet.treasurenet.io",
  "shortName": "tntest",
  "chainId": 5005,
  "networkId": 5005,
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.testnet.treasurenet.io",
      "icon": {
        "url": "ipfs://QmTcNX8ukHkXiVfVah1W8Sed3vtGN95Sq2QSimfLuHva6B",
        "width": 1844,
        "height": 1920,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "treasurenet-testnet"
} as const satisfies Chain;