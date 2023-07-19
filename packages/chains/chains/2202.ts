import type { Chain } from "../src/types";
export default {
  "name": "Antofy Mainnet",
  "chain": "ABN",
  "icon": {
    "url": "ipfs://QmdTfku81ohnG9ECU1Xswmeumt678cBhwHWuFYZ7i1Qsto",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://antofy.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.antofy.io"
  ],
  "faucets": [
    "https://faucet.antofy.io"
  ],
  "nativeCurrency": {
    "name": "Antofy",
    "symbol": "ABN",
    "decimals": 18
  },
  "infoURL": "https://antofy.io",
  "shortName": "ABNm",
  "chainId": 2202,
  "networkId": 2202,
  "explorers": [
    {
      "name": "Antofy Mainnet",
      "url": "https://antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "antofy"
} as const satisfies Chain;