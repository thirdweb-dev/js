import type { Chain } from "../src/types";
export default {
  "chain": "Dxchain",
  "chainId": 36,
  "explorers": [
    {
      "name": "dxscan",
      "url": "https://dxscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.dxchain.com/",
  "name": "Dxchain Mainnet",
  "nativeCurrency": {
    "name": "Dxchain",
    "symbol": "DX",
    "decimals": 18
  },
  "networkId": 36,
  "rpc": [
    "https://36.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.dxchain.com"
  ],
  "shortName": "dx",
  "slug": "dxchain",
  "testnet": false
} as const satisfies Chain;