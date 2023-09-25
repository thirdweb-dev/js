import type { Chain } from "../src/types";
export default {
  "chainId": 114,
  "chain": "FLR",
  "name": "Flare Testnet Coston2",
  "rpc": [
    "https://flare-testnet-coston2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston2-api.flare.network/ext/bc/C/rpc"
  ],
  "slug": "flare-testnet-coston2",
  "icon": {
    "url": "ipfs://QmZhAYyazEBZSHWNQb9uCkNPq2MNTLoW3mjwiD3955hUjw",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "faucets": [
    "https://coston2-faucet.towolabs.com"
  ],
  "nativeCurrency": {
    "name": "Coston2 Flare",
    "symbol": "C2FLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "c2flr",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston2-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;