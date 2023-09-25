import type { Chain } from "../src/types";
export default {
  "chainId": 877,
  "chain": "DXT",
  "name": "Dexit Network",
  "rpc": [
    "https://dexit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dxt.dexit.network"
  ],
  "slug": "dexit-network",
  "faucets": [
    "https://faucet.dexit.network"
  ],
  "nativeCurrency": {
    "name": "Dexit network",
    "symbol": "DXT",
    "decimals": 18
  },
  "infoURL": "https://dexit.network",
  "shortName": "DXT",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "dxtscan",
      "url": "https://dxtscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;