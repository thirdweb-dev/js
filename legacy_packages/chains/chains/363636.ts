import type { Chain } from "../src/types";
export default {
  "chain": "DS2",
  "chainId": 363636,
  "explorers": [
    {
      "name": "Digit Soul Explorer",
      "url": "https://dgs-exp.digitsoul.co.th",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "name": "Digit Soul Smart Chain 2",
  "nativeCurrency": {
    "name": "Digit Coin",
    "symbol": "DGC",
    "decimals": 18
  },
  "networkId": 363636,
  "rpc": [
    "https://363636.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dgs-rpc.digitsoul.co.th"
  ],
  "shortName": "DS2",
  "slug": "digit-soul-smart-chain-2",
  "testnet": false
} as const satisfies Chain;