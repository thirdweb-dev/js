import type { Chain } from "../src/types";
export default {
  "chain": "L3X",
  "chainId": 12324,
  "explorers": [
    {
      "name": "L3X Mainnet Explorer",
      "url": "https://explorer.l3x.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://l3x.com",
  "name": "L3X Protocol",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 12324,
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "rpc": [
    "https://12324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.l3x.com"
  ],
  "shortName": "l3x",
  "slug": "l3x-protocol",
  "testnet": false
} as const satisfies Chain;