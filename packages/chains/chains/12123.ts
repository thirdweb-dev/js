import type { Chain } from "../src/types";
export default {
  "chainId": 12123,
  "chain": "BRC",
  "name": "BRC Chain Mainnet",
  "rpc": [
    "https://brc-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brcchain.io"
  ],
  "slug": "brc-chain",
  "icon": {
    "url": "ipfs://QmX8qGX7xoZqYUpHxA85uZwQX2fgbTHvmddE1NfseDyBED",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.brcchain.io"
  ],
  "nativeCurrency": {
    "name": "BRC Chain mainnet native token",
    "symbol": "BRC",
    "decimals": 18
  },
  "infoURL": "https://bridge.brcchain.io",
  "shortName": "BRC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BRC Chain Explorer",
      "url": "https://scan.brcchain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;