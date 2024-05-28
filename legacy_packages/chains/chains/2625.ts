import type { Chain } from "../src/types";
export default {
  "chain": "WBT",
  "chainId": 2625,
  "explorers": [
    {
      "name": "whitechain-testnet-explorer",
      "url": "https://testnet.whitechain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet.whitechain.io/faucet"
  ],
  "infoURL": "https://whitechain.io",
  "name": "Whitechain Testnet",
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "networkId": 2625,
  "rpc": [
    "https://2625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.whitechain.io"
  ],
  "shortName": "twbt",
  "slip44": 1,
  "slug": "whitechain-testnet",
  "testnet": true
} as const satisfies Chain;