import type { Chain } from "../src/types";
export default {
  "chain": "OLO",
  "chainId": 8723,
  "explorers": [
    {
      "name": "OLO Block Explorer",
      "url": "https://www.olo.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://ibdt.io",
  "name": "TOOL Global Mainnet",
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tool-global.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-web3.wolot.io"
  ],
  "shortName": "olo",
  "slug": "tool-global",
  "testnet": false
} as const satisfies Chain;