import type { Chain } from "../src/types";
export default {
  "chainId": 474142,
  "chain": "OpenChain",
  "name": "OpenChain Mainnet",
  "rpc": [
    "https://openchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baas-rpc.luniverse.io:18545?lChainId=1641349324562974539"
  ],
  "slug": "openchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "OpenCoin",
    "symbol": "OPC",
    "decimals": 10
  },
  "infoURL": "https://www.openchain.live",
  "shortName": "oc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SIDE SCAN",
      "url": "https://sidescan.luniverse.io/1641349324562974539",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;