import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 42170,
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "dexguru",
      "url": "https://nova.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum Nova",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 42170,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "rpc": [
    "https://arbitrum-nova.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://42170.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.arbitrum.io/rpc",
    "https://arbitrum-nova.publicnode.com",
    "wss://arbitrum-nova.publicnode.com"
  ],
  "shortName": "arb-nova",
  "slug": "arbitrum-nova",
  "testnet": false
} as const satisfies Chain;