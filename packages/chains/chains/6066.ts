import type { Chain } from "../src/types";
export default {
  "chainId": 6066,
  "chain": "TresLeches",
  "name": "Tres Mainnet",
  "rpc": [
    "https://tres.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tresleches.finance/",
    "https://rpc.treschain.io/"
  ],
  "slug": "tres",
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "shortName": "TRESMAIN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer.tresleches.finance",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;