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
  "infoURL": "https://eleanor.metatime.com",
  "name": "Eleanor",
  "nativeCurrency": {
    "name": "Eleanor Metacoin",
    "symbol": "MTC",
    "decimals": 18
  },
  "networkId": 1967,
  "rpc": [
    "https://1967.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metatime.com/eleanor",
    "wss://ws.metatime.com/eleanor"
  ],
  "shortName": "mtc",
  "slip44": 1,
  "slug": "eleanor",
  "testnet": true,
  "title": "Metatime Testnet Eleanor"
} as const satisfies Chain;