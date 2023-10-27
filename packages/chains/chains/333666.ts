import type { Chain } from "../src/types";
export default {
  "chain": "OONE Testnet",
  "chainId": 333666,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.oonescan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://apps-test.adigium.com/faucet"
  ],
  "infoURL": "https://oonechain.com",
  "name": "Oone Chain Testnet",
  "nativeCurrency": {
    "name": "tOONE",
    "symbol": "tOONE",
    "decimals": 18
  },
  "networkId": 333666,
  "rpc": [
    "https://oone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://333666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oonechain.com"
  ],
  "shortName": "oonetest",
  "slug": "oone-chain-testnet",
  "testnet": true
} as const satisfies Chain;