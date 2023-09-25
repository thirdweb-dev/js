import type { Chain } from "../src/types";
export default {
  "chainId": 23006,
  "chain": "ABN",
  "name": "Antofy Testnet",
  "rpc": [
    "https://antofy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.antofy.io"
  ],
  "slug": "antofy-testnet",
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
  "shortName": "ABNt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Antofy Testnet",
      "url": "https://test.antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;