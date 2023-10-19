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
  "features": [],
  "infoURL": "https://islamiccoin.net",
  "name": "Haqq Network",
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://haqq-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.haqq.network",
    "https://haqq-evm.publicnode.com",
    "wss://haqq-evm.publicnode.com"
  ],
  "shortName": "ISLM",
  "slug": "haqq-network",
  "testnet": false
} as const satisfies Chain;