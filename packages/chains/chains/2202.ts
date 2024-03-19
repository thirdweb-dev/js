import type { Chain } from "../src/types";
export default {
  "chain": "ABN",
  "chainId": 2202,
  "explorers": [
    {
      "name": "Antofy Mainnet",
      "url": "https://antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.antofy.io"
  ],
  "infoURL": "https://antofy.io",
  "name": "Antofy Mainnet",
  "nativeCurrency": {
    "name": "Antofy",
    "symbol": "ABN",
    "decimals": 18
  },
  "networkId": 2202,
  "rpc": [
    "https://2202.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.antofy.io"
  ],
  "shortName": "ABNm",
  "slug": "antofy",
  "testnet": false
} as const satisfies Chain;