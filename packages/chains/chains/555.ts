import type { Chain } from "../src/types";
export default {
  "chain": "VELA1",
  "chainId": 555,
  "explorers": [
    {
      "name": "Vela1 Chain Mainnet Explorer",
      "url": "https://exp.velaverse.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://velaverse.io",
  "name": "Vela1 Chain Mainnet",
  "nativeCurrency": {
    "name": "CLASS COIN",
    "symbol": "CLASS",
    "decimals": 18
  },
  "networkId": 555,
  "rpc": [
    "https://vela1-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.velaverse.io"
  ],
  "shortName": "CLASS",
  "slug": "vela1-chain",
  "testnet": false
} as const satisfies Chain;