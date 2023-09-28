import type { Chain } from "../src/types";
export default {
  "name": "Oone Chain Devnet",
  "chain": "OONE Devnet",
  "rpc": [
    "https://oone-chain-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.oonechain.com"
  ],
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
  "chainId": 333777,
  "networkId": 333777,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://dev.oonescan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "oone-chain-devnet"
} as const satisfies Chain;