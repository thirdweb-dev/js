import type { Chain } from "../src/types";
export default {
  "chain": "SoChain",
  "chainId": 281121,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://digitalnext.business/SocialSmartChain",
  "name": "Social Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "SoChain",
    "symbol": "$OC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://social-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://socialsmartchain.digitalnext.business"
  ],
  "shortName": "SoChain",
  "slug": "social-smart-chain",
  "testnet": false
} as const satisfies Chain;