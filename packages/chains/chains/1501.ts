import type { Chain } from "../src/types";
export default {
  "chain": "ChainX",
  "chainId": 1501,
  "explorers": [
    {
      "name": "bevm canary scan",
      "url": "https://scan-canary.bevm.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://cloudflare-ipfs.com/ipfs/bafkreibvwfrow3w6q5qj2mk6n7yx5oahxzgn3pnghdr76zsyxvc3l5hh7y",
    "width": 3600,
    "height": 3600,
    "format": "png"
  },
  "infoURL": "https://chainx.org",
  "name": "BEVM Canary",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 1501,
  "redFlags": [],
  "rpc": [
    "https://1501.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-canary-1.bevm.io/",
    "https://rpc-canary-2.bevm.io/"
  ],
  "shortName": "chainx",
  "slug": "bevm-canary",
  "testnet": false
} as const satisfies Chain;