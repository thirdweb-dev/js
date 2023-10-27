import type { Chain } from "../src/types";
export default {
  "chain": "BRC",
  "chainId": 12123,
  "explorers": [
    {
      "name": "BRC Chain Explorer",
      "url": "https://scan.brcchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.brcchain.io"
  ],
  "icon": {
    "url": "ipfs://QmX8qGX7xoZqYUpHxA85uZwQX2fgbTHvmddE1NfseDyBED",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://bridge.brcchain.io",
  "name": "BRC Chain Mainnet",
  "nativeCurrency": {
    "name": "BRC Chain mainnet native token",
    "symbol": "BRC",
    "decimals": 18
  },
  "networkId": 12123,
  "rpc": [
    "https://brc-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brcchain.io"
  ],
  "shortName": "BRC",
  "slug": "brc-chain",
  "testnet": false
} as const satisfies Chain;