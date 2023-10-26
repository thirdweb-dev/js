import type { Chain } from "../src/types";
export default {
  "chain": "DoKEN Super Chain",
  "chainId": 61916,
  "explorers": [
    {
      "name": "DSC Scan",
      "url": "https://explore.doken.dev",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreifms4eio6v56oyeemnnu5luq3sc44hptan225lr45itgzu3u372iu",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifms4eio6v56oyeemnnu5luq3sc44hptan225lr45itgzu3u372iu",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://doken.dev/",
  "name": "DoKEN Super Chain Mainnet",
  "nativeCurrency": {
    "name": "DoKEN",
    "symbol": "DKN",
    "decimals": 18
  },
  "networkId": 61916,
  "rpc": [
    "https://doken-super-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://61916.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sgrpc.doken.dev",
    "https://nyrpc.doken.dev",
    "https://ukrpc.doken.dev"
  ],
  "shortName": "DoKEN",
  "slug": "doken-super-chain",
  "testnet": false
} as const satisfies Chain;