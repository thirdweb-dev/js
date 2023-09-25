import type { Chain } from "../src/types";
export default {
  "chainId": 281121,
  "chain": "SoChain",
  "name": "Social Smart Chain Mainnet",
  "rpc": [
    "https://social-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://socialsmartchain.digitalnext.business"
  ],
  "slug": "social-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "SoChain",
    "symbol": "$OC",
    "decimals": 18
  },
  "infoURL": "https://digitalnext.business/SocialSmartChain",
  "shortName": "SoChain",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;