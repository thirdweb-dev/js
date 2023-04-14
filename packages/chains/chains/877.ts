import type { Chain } from "../src/types";
export default {
  "name": "Dexit Network",
  "chain": "DXT",
  "rpc": [
    "https://dexit-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dxt.dexit.network"
  ],
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
  "chainId": 877,
  "networkId": 877,
  "explorers": [
    {
      "name": "dxtscan",
      "url": "https://dxtscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dexit-network"
} as const satisfies Chain;