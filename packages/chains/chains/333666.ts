import type { Chain } from "../src/types";
export default {
  "name": "Oone Chain Testnet",
  "chain": "OONE Testnet",
  "rpc": [
    "https://oone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oonechain.com"
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
  "shortName": "oonetest",
  "chainId": 333666,
  "networkId": 333666,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.oonescan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "oone-chain-testnet"
} as const satisfies Chain;