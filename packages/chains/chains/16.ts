import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 16,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.towolabs.com",
    "https://fauceth.komputing.org?chain=16&address=${ADDRESS}"
  ],
  "icon": {
    "url": "ipfs://QmW7Ljv2eLQ1poRrhJBaVWJBF1TyfZ8QYxDeELRo6sssrj",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "infoURL": "https://flare.xyz",
  "name": "Flare Testnet Coston",
  "nativeCurrency": {
    "name": "Coston Flare",
    "symbol": "CFLR",
    "decimals": 18
  },
  "networkId": 16,
  "rpc": [
    "https://flare-testnet-coston.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://16.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston-api.flare.network/ext/bc/C/rpc"
  ],
  "shortName": "cflr",
  "slug": "flare-testnet-coston",
  "testnet": true
} as const satisfies Chain;