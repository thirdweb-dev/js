import type { Chain } from "../src/types";
export default {
  "chainId": 39,
  "chain": "u2u",
  "name": "U2U Solaris Mainnet",
  "rpc": [
    "https://u2u-solaris.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.uniultra.xyz"
  ],
  "slug": "u2u-solaris",
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Unicorn Ultra",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://uniultra.xyz",
  "shortName": "u2u",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "U2U Explorer",
      "url": "https://u2uscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;