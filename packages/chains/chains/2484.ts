import type { Chain } from "../src/types";
export default {
  "chain": "u2u",
  "chainId": 2484,
  "explorers": [
    {
      "name": "U2U Explorer",
      "url": "https://testnet.u2uscan.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.uniultra.xyz"
  ],
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://uniultra.xyz",
  "name": "Unicorn Ultra Nebulas Testnet",
  "nativeCurrency": {
    "name": "Unicorn Ultra Nebulas Testnet",
    "symbol": "U2U",
    "decimals": 18
  },
  "networkId": 2484,
  "rpc": [
    "https://unicorn-ultra-nebulas-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2484.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nebulas-testnet.uniultra.xyz"
  ],
  "shortName": "u2u_nebulas",
  "slip44": 1,
  "slug": "unicorn-ultra-nebulas-testnet",
  "testnet": true
} as const satisfies Chain;