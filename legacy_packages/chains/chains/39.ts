import type { Chain } from "../src/types";
export default {
  "chain": "u2u",
  "chainId": 39,
  "explorers": [
    {
      "name": "U2U Explorer",
      "url": "https://u2uscan.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://uniultra.xyz",
  "name": "U2U Solaris Mainnet",
  "nativeCurrency": {
    "name": "Unicorn Ultra",
    "symbol": "U2U",
    "decimals": 18
  },
  "networkId": 39,
  "rpc": [
    "https://39.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.uniultra.xyz"
  ],
  "shortName": "u2u",
  "slug": "u2u-solaris",
  "testnet": false
} as const satisfies Chain;