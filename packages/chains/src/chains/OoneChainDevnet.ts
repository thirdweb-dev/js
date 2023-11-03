import type { Chain } from "../types";
export default {
  "chain": "OONE Devnet",
  "chainId": 333777,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://dev.oonescan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "infoURL": "https://oonechain.com",
  "name": "Oone Chain Devnet",
  "nativeCurrency": {
    "name": "tOONE",
    "symbol": "tOONE",
    "decimals": 18
  },
  "networkId": 333777,
  "rpc": [
    "https://oone-chain-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://333777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.oonechain.com"
  ],
  "shortName": "oonedev",
  "slug": "oone-chain-devnet",
  "testnet": true
} as const satisfies Chain;