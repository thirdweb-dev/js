import type { Chain } from "../src/types";
export default {
  "chainId": 1967,
  "chain": "MTC",
  "name": "Eleanor",
  "rpc": [
    "https://eleanor.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metatime.com/eleanor",
    "wss://ws.metatime.com/eleanor"
  ],
  "slug": "eleanor",
  "faucets": [
    "https://faucet.metatime.com/eleanor"
  ],
  "nativeCurrency": {
    "name": "Eleanor Metacoin",
    "symbol": "MTC",
    "decimals": 18
  },
  "infoURL": "https://eleanor.metatime.com",
  "shortName": "mtc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "metaexplorer-eleanor",
      "url": "https://explorer.metatime.com/eleanor",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;