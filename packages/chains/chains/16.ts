import type { Chain } from "../src/types";
export default {
  "chainId": 16,
  "chain": "FLR",
  "name": "Flare Testnet Coston",
  "rpc": [
    "https://flare-testnet-coston.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston-api.flare.network/ext/bc/C/rpc"
  ],
  "slug": "flare-testnet-coston",
  "icon": {
    "url": "ipfs://QmW7Ljv2eLQ1poRrhJBaVWJBF1TyfZ8QYxDeELRo6sssrj",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "faucets": [
    "https://faucet.towolabs.com",
    "https://fauceth.komputing.org?chain=16&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Coston Flare",
    "symbol": "CFLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "cflr",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;