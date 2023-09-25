import type { Chain } from "../src/types";
export default {
  "chainId": 2202,
  "chain": "ABN",
  "name": "Antofy Mainnet",
  "rpc": [
    "https://antofy.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.antofy.io"
  ],
  "slug": "antofy",
  "icon": {
    "url": "ipfs://QmdTfku81ohnG9ECU1Xswmeumt678cBhwHWuFYZ7i1Qsto",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Antofy Mainnet",
      "url": "https://antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;