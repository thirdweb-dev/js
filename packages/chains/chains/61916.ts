import type { Chain } from "../src/types";
export default {
  "chainId": 61916,
  "chain": "DoKEN Super Chain",
  "name": "DoKEN Super Chain Mainnet",
  "rpc": [
    "https://doken-super-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sgrpc.doken.dev",
    "https://nyrpc.doken.dev",
    "https://ukrpc.doken.dev"
  ],
  "slug": "doken-super-chain",
  "icon": {
    "url": "ipfs://bafkreifms4eio6v56oyeemnnu5luq3sc44hptan225lr45itgzu3u372iu",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "DoKEN",
    "symbol": "DKN",
    "decimals": 18
  },
  "infoURL": "https://doken.dev/",
  "shortName": "DoKEN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "DSC Scan",
      "url": "https://explore.doken.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;