import type { Chain } from "../src/types";
export default {
  "name": "BRC Chain Mainnet",
  "chain": "BRC",
  "rpc": [
    "https://brc-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brcchain.io"
  ],
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
  "chainId": 12123,
  "networkId": 12123,
  "icon": {
    "url": "ipfs://QmX8qGX7xoZqYUpHxA85uZwQX2fgbTHvmddE1NfseDyBED",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "BRC Chain Explorer",
      "url": "https://scan.brcchain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "brc-chain"
} as const satisfies Chain;