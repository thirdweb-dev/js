import type { Chain } from "../src/types";
export default {
  "chainId": 555,
  "chain": "VELA1",
  "name": "Vela1 Chain Mainnet",
  "rpc": [
    "https://vela1-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.velaverse.io"
  ],
  "slug": "vela1-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "CLASS COIN",
    "symbol": "CLASS",
    "decimals": 18
  },
  "infoURL": "https://velaverse.io",
  "shortName": "CLASS",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Vela1 Chain Mainnet Explorer",
      "url": "https://exp.velaverse.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;