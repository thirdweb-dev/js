import type { Chain } from "../src/types";
export default {
  "chain": "DXT",
  "chainId": 877,
  "explorers": [
    {
      "name": "dxtscan",
      "url": "https://dxtscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dexit.network"
  ],
  "infoURL": "https://dexit.network",
  "name": "Dexit Network",
  "nativeCurrency": {
    "name": "Dexit network",
    "symbol": "DXT",
    "decimals": 18
  },
  "networkId": 877,
  "rpc": [
    "https://dexit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://877.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dxt.dexit.network"
  ],
  "shortName": "DXT",
  "slug": "dexit-network",
  "testnet": false
} as const satisfies Chain;