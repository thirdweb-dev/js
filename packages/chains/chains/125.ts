import type { Chain } from "../src/types";
export default {
  "chain": "OYchain",
  "chainId": 125,
  "explorers": [
    {
      "name": "OYchain Testnet Explorer",
      "url": "https://explorer.testnet.oychain.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.oychain.io"
  ],
  "features": [],
  "infoURL": "https://www.oychain.io",
  "name": "OYchain Testnet",
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oychain.io"
  ],
  "shortName": "OYchainTestnet",
  "slug": "oychain-testnet",
  "testnet": true
} as const satisfies Chain;