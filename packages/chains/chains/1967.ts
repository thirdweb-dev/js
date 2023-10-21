import type { Chain } from "../src/types";
export default {
  "chain": "MTC",
  "chainId": 1967,
  "explorers": [
    {
      "name": "metaexplorer-eleanor",
      "url": "https://explorer.metatime.com/eleanor",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.metatime.com/eleanor"
  ],
  "features": [],
  "infoURL": "https://eleanor.metatime.com",
  "name": "Eleanor",
  "nativeCurrency": {
    "name": "Eleanor Metacoin",
    "symbol": "MTC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://eleanor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metatime.com/eleanor",
    "wss://ws.metatime.com/eleanor"
  ],
  "shortName": "mtc",
  "slug": "eleanor",
  "testnet": true
} as const satisfies Chain;