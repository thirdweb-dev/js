import type { Chain } from "../src/types";
export default {
  "chain": "Vision",
  "chainId": 888888,
  "explorers": [
    {
      "name": "Visionscan",
      "url": "https://www.visionscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.v.network",
  "name": "Vision - Mainnet",
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "networkId": 888888,
  "rpc": [
    "https://888888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://infragrid.v.network/ethereum/compatible"
  ],
  "shortName": "vision",
  "slip44": 60,
  "slug": "vision",
  "testnet": false
} as const satisfies Chain;