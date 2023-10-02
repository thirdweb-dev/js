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
  "features": [],
  "icon": {
    "url": "ipfs://QmYBup5bWoBfkaHntbcgW8Ji7ncad7f53deJ4Q55z4PNQs",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://www.dxchain.com/",
  "name": "Dxchain Mainnet",
  "nativeCurrency": {
    "name": "Dxchain",
    "symbol": "DX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.dxchain.com"
  ],
  "shortName": "dx",
  "slug": "dxchain",
  "testnet": false
} as const satisfies Chain;