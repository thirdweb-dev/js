import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 114,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston2-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://coston2-faucet.towolabs.com"
  ],
  "icon": {
    "url": "ipfs://QmZhAYyazEBZSHWNQb9uCkNPq2MNTLoW3mjwiD3955hUjw",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "infoURL": "https://flare.xyz",
  "name": "Flare Testnet Coston2",
  "nativeCurrency": {
    "name": "Coston2 Flare",
    "symbol": "C2FLR",
    "decimals": 18
  },
  "networkId": 114,
  "rpc": [
    "https://flare-testnet-coston2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://114.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston2-api.flare.network/ext/bc/C/rpc"
  ],
  "shortName": "c2flr",
  "slip44": 1,
  "slug": "flare-testnet-coston2",
  "testnet": true
} as const satisfies Chain;