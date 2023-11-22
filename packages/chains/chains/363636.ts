import type { Chain } from "../src/types";
export default {
  "chain": "DS2",
  "chainId": 363636,
  "explorers": [],
  "faucets": [],
  "name": "Digit Soul Smart Chain 2",
  "nativeCurrency": {
    "name": "Digit Coin",
    "symbol": "DGC",
    "decimals": 18
  },
  "networkId": 363636,
  "rpc": [
    "https://digit-soul-smart-chain-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://363636.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://dgs-rpc.digitsoul.co.th"
  ],
  "shortName": "DS2",
  "slug": "digit-soul-smart-chain-2",
  "testnet": false
} as const satisfies Chain;