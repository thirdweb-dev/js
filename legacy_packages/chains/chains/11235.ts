import type { Chain } from "../src/types";
export default {
  "chain": "Haqq",
  "chainId": 11235,
  "explorers": [
    {
      "name": "Mainnet HAQQ Explorer",
      "url": "https://explorer.haqq.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://islamiccoin.net",
  "name": "Haqq Network",
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLM",
    "decimals": 18
  },
  "networkId": 11235,
  "rpc": [
    "https://11235.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.haqq.network",
    "https://haqq-evm-rpc.publicnode.com",
    "wss://haqq-evm-rpc.publicnode.com",
    "https://haqq.drpc.org",
    "wss://haqq.drpc.org"
  ],
  "shortName": "ISLM",
  "slug": "haqq-network",
  "testnet": false
} as const satisfies Chain;