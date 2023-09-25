import type { Chain } from "../src/types";
export default {
  "chainId": 333777,
  "chain": "OONE Devnet",
  "name": "Oone Chain Devnet",
  "rpc": [
    "https://oone-chain-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.oonechain.com"
  ],
  "slug": "oone-chain-devnet",
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "nativeCurrency": {
    "name": "tOONE",
    "symbol": "tOONE",
    "decimals": 18
  },
  "infoURL": "https://oonechain.com",
  "shortName": "oonedev",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://dev.oonescan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;