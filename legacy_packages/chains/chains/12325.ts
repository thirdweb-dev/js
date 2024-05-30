import type { Chain } from "../src/types";
export default {
  "chain": "L3X",
  "chainId": 12325,
  "explorers": [
    {
      "name": "L3X Testnet Explorer",
      "url": "https://explorer-testnet.l3x.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmf1cim2ZvkgszKiFtmZj3K1z2YgVY7A4VtLkWw8kQxijq",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "infoURL": "https://l3x.com",
  "name": "L3X Protocol Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 12325,
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "rpc": [
    "https://12325.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.l3x.com"
  ],
  "shortName": "l3x-testnet",
  "slug": "l3x-protocol-testnet",
  "testnet": true
} as const satisfies Chain;