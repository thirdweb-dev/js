import type { Chain } from "../types";
export default {
  "chain": "SoChain",
  "chainId": 281121,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://digitalnext.business/SocialSmartChain",
  "name": "Social Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "SoChain",
    "symbol": "$OC",
    "decimals": 18
  },
  "networkId": 281121,
  "rpc": [
    "https://social-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://281121.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://socialsmartchain.digitalnext.business"
  ],
  "shortName": "SoChain",
  "slug": "social-smart-chain",
  "testnet": false
} as const satisfies Chain;