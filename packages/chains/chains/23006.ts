import type { Chain } from "../src/types";
export default {
  "chain": "ABN",
  "chainId": 23006,
  "explorers": [
    {
      "name": "Antofy Testnet",
      "url": "https://test.antofyscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.antofy.io"
  ],
  "icon": {
    "url": "ipfs://QmdTfku81ohnG9ECU1Xswmeumt678cBhwHWuFYZ7i1Qsto",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://antofy.io",
  "name": "Antofy Testnet",
  "nativeCurrency": {
    "name": "Antofy",
    "symbol": "ABN",
    "decimals": 18
  },
  "networkId": 23006,
  "rpc": [
    "https://antofy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://23006.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.antofy.io"
  ],
  "shortName": "ABNt",
  "slug": "antofy-testnet",
  "testnet": true
} as const satisfies Chain;