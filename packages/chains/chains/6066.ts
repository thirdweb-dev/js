import type { Chain } from "../src/types";
export default {
  "chain": "TresLeches",
  "chainId": 6066,
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer.tresleches.finance",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://treschain.com",
  "name": "Tres Mainnet",
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tres.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tresleches.finance/",
    "https://rpc.treschain.io/"
  ],
  "shortName": "TRESMAIN",
  "slug": "tres",
  "testnet": false
} as const satisfies Chain;