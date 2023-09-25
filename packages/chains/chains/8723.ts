import type { Chain } from "../src/types";
export default {
  "chainId": 8723,
  "chain": "OLO",
  "name": "TOOL Global Mainnet",
  "rpc": [
    "https://tool-global.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-web3.wolot.io"
  ],
  "slug": "tool-global",
  "faucets": [],
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "infoURL": "https://ibdt.io",
  "shortName": "olo",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OLO Block Explorer",
      "url": "https://www.olo.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;