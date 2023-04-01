import type { Chain } from "../src/types";
export default {
  "name": "Social Smart Chain Mainnet",
  "chain": "SoChain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "SoChain",
    "symbol": "$OC",
    "decimals": 18
  },
  "infoURL": "https://digitalnext.business/SocialSmartChain",
  "shortName": "SoChain",
  "chainId": 281121,
  "networkId": 281121,
  "explorers": [],
  "testnet": false,
  "slug": "social-smart-chain"
} as const satisfies Chain;