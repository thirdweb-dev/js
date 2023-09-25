import type { Chain } from "../src/types";
export default {
  "chainId": 8724,
  "chain": "OLO",
  "name": "TOOL Global Testnet",
  "rpc": [
    "https://tool-global-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-web3.wolot.io"
  ],
  "slug": "tool-global-testnet",
  "faucets": [
    "https://testnet-explorer.wolot.io"
  ],
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "infoURL": "https://testnet-explorer.wolot.io",
  "shortName": "tolo",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;