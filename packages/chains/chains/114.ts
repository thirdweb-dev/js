import type { Chain } from "../src/types";
export default {
  "name": "Flare Testnet Coston2",
  "chain": "FLR",
  "icon": {
    "url": "ipfs://QmZhAYyazEBZSHWNQb9uCkNPq2MNTLoW3mjwiD3955hUjw",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "rpc": [
    "https://flare-testnet-coston2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston2-api.flare.network/ext/bc/C/rpc"
  ],
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
  "chainId": 114,
  "networkId": 114,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston2-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "flare-testnet-coston2"
} as const satisfies Chain;