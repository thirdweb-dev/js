import type { Chain } from "../src/types";
export default {
  "chain": "OLO",
  "chainId": 8724,
  "explorers": [],
  "faucets": [
    "https://testnet-explorer.wolot.io"
  ],
  "features": [],
  "infoURL": "https://testnet-explorer.wolot.io",
  "name": "TOOL Global Testnet",
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tool-global-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-web3.wolot.io"
  ],
  "shortName": "tolo",
  "slug": "tool-global-testnet",
  "testnet": true
} as const satisfies Chain;