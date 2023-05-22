import type { Chain } from "../src/types";
export default {
  "name": "Arbitrum Nova",
  "chainId": 42170,
  "shortName": "arb-nova",
  "chain": "ETH",
  "networkId": 42170,
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://arbitrum-nova.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.arbitrum.io/rpc"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://arbitrum.io",
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "testnet": false,
  "slug": "arbitrum-nova"
} as const satisfies Chain;