import type { Chain } from "../src/types";
export default {
  "chain": "OpenChain",
  "chainId": 474142,
  "explorers": [
    {
      "name": "SIDE SCAN",
      "url": "https://sidescan.luniverse.io/1641349324562974539",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.openchain.live",
  "name": "OpenChain Mainnet",
  "nativeCurrency": {
    "name": "OpenCoin",
    "symbol": "OPC",
    "decimals": 10
  },
  "redFlags": [],
  "rpc": [
    "https://openchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baas-rpc.luniverse.io:18545?lChainId=1641349324562974539"
  ],
  "shortName": "oc",
  "slug": "openchain",
  "testnet": false
} as const satisfies Chain;