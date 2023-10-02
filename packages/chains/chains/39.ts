import type { Chain } from "../src/types";
export default {
  "name": "U2U Solaris Mainnet",
  "chain": "u2u",
  "rpc": [
    "https://u2u-solaris.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.uniultra.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unicorn Ultra",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://uniultra.xyz",
  "shortName": "u2u",
  "chainId": 39,
  "networkId": 39,
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "icon": {
        "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "name": "U2U Explorer",
      "url": "https://u2uscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "u2u-solaris"
} as const satisfies Chain;