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
    "https://nova.arbitrum.io/rpc",
    "https://arbitrum-nova.publicnode.com",
    "wss://arbitrum-nova.publicnode.com"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
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