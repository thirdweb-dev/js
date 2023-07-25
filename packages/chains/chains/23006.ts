import type { Chain } from "../src/types";
export default {
  "name": "Antofy Testnet",
  "chain": "ABN",
  "icon": {
    "url": "ipfs://QmdTfku81ohnG9ECU1Xswmeumt678cBhwHWuFYZ7i1Qsto",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://antofy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.antofy.io"
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
  "shortName": "ABNt",
  "chainId": 23006,
  "networkId": 23006,
  "explorers": [
    {
      "name": "Antofy Testnet",
      "url": "https://test.antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "antofy-testnet"
} as const satisfies Chain;