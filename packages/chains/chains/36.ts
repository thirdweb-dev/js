import type { Chain } from "../src/types";
export default {
  "chainId": 36,
  "chain": "Dxchain",
  "name": "Dxchain Mainnet",
  "rpc": [
    "https://dxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.dxchain.com"
  ],
  "slug": "dxchain",
  "icon": {
    "url": "ipfs://QmYBup5bWoBfkaHntbcgW8Ji7ncad7f53deJ4Q55z4PNQs",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Dxchain",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://www.dxchain.com/",
  "shortName": "dx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "dxscan",
      "url": "https://dxscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;