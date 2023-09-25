import type { Chain } from "../src/types";
export default {
  "chainId": 11235,
  "chain": "Haqq",
  "name": "Haqq Network",
  "rpc": [
    "https://haqq-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.haqq.network",
    "https://haqq-evm.publicnode.com",
    "wss://haqq-evm.publicnode.com"
  ],
  "slug": "haqq-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLM",
    "decimals": 18
  },
  "infoURL": "https://islamiccoin.net",
  "shortName": "ISLM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mainnet HAQQ Explorer",
      "url": "https://explorer.haqq.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;