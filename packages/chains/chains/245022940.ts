import type { Chain } from "../src/types";
export default {
  "chain": "Solana",
  "chainId": 245022940,
  "explorers": [
    {
      "name": "native",
      "url": "https://testnet.explorer.neon-labs.org",
      "standard": "EIP3091"
    },
    {
      "name": "neonscan",
      "url": "https://testnet.neonscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neon-labs.org",
  "name": "Neon EVM TestNet",
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "networkId": 245022940,
  "rpc": [
    "https://neon-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://245022940.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonevm.org"
  ],
  "shortName": "neonevm-testnet",
  "slug": "neon-evm-testnet",
  "testnet": true
} as const satisfies Chain;