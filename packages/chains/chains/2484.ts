import type { Chain } from "../src/types";
export default {
  "chainId": 2484,
  "chain": "u2u",
  "name": "Unicorn Ultra Nebulas Testnet",
  "rpc": [
    "https://unicorn-ultra-nebulas-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nebulas-testnet.uniultra.xyz"
  ],
  "slug": "unicorn-ultra-nebulas-testnet",
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "U2U Explorer",
      "url": "https://testnet.u2uscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;