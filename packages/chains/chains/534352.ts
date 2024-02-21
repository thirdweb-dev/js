import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534352,
  "explorers": [
    {
      "name": "Scrollscan",
      "url": "https://scrollscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 534352,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://scroll.io/bridge"
      }
    ]
  },
  "rpc": [
    "https://534352.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scroll.io",
    "https://rpc-scroll.icecreamswap.com",
    "https://rpc.ankr.com/scroll",
    "https://scroll-mainnet.chainstacklabs.com"
  ],
  "shortName": "scr",
  "slug": "scroll",
  "status": "active",
  "testnet": false
} as const satisfies Chain;