import type { Chain } from "../src/types";
export default {
  "chainId": 333666,
  "chain": "OONE Testnet",
  "name": "Oone Chain Testnet",
  "rpc": [
    "https://oone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oonechain.com"
  ],
  "slug": "oone-chain-testnet",
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "nativeCurrency": {
    "name": "tOONE",
    "symbol": "tOONE",
    "decimals": 18
  },
  "infoURL": "https://oonechain.com",
  "shortName": "oonetest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.oonescan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;