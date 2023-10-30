import type { Chain } from "../src/types";
export default {
  "chain": "REDLC",
  "chainId": 2611,
  "explorers": [
    {
      "name": "REDLC Explorer",
      "url": "https://redlightscan.finance",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://redlight.finance/",
  "name": "Redlight Chain Mainnet",
  "nativeCurrency": {
    "name": "Redlight Coin",
    "symbol": "REDLC",
    "decimals": 18
  },
  "networkId": 2611,
  "rpc": [
    "https://redlight-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2611.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed2.redlightscan.finance"
  ],
  "shortName": "REDLC",
  "slug": "redlight-chain",
  "testnet": false
} as const satisfies Chain;