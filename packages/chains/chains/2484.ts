import type { Chain } from "../src/types";
export default {
  "name": "Unicorn Ultra Nebulas Testnet",
  "chain": "u2u",
  "rpc": [
    "https://unicorn-ultra-nebulas-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nebulas-testnet.uniultra.xyz"
  ],
  "faucets": [
    "https://faucet.uniultra.xyz"
  ],
  "nativeCurrency": {
    "name": "Unicorn Ultra Nebulas Testnet",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://uniultra.xyz",
  "shortName": "u2u_nebulas",
  "chainId": 2484,
  "networkId": 2484,
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
      "url": "https://testnet.u2uscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "unicorn-ultra-nebulas-testnet"
} as const satisfies Chain;