import type { Chain } from "../src/types";
export default {
  "chainId": 125,
  "chain": "OYchain",
  "name": "OYchain Testnet",
  "rpc": [
    "https://oychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oychain.io"
  ],
  "slug": "oychain-testnet",
  "faucets": [
    "https://faucet.oychain.io"
  ],
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "infoURL": "https://www.oychain.io",
  "shortName": "OYchainTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OYchain Testnet Explorer",
      "url": "https://explorer.testnet.oychain.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;