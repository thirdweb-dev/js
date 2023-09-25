import type { Chain } from "../src/types";
export default {
  "chainId": 2611,
  "chain": "REDLC",
  "name": "Redlight Chain Mainnet",
  "rpc": [
    "https://redlight-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed2.redlightscan.finance"
  ],
  "slug": "redlight-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Redlight Coin",
    "symbol": "REDLC",
    "decimals": 18
  },
  "infoURL": "https://redlight.finance/",
  "shortName": "REDLC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "REDLC Explorer",
      "url": "https://redlightscan.finance",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;