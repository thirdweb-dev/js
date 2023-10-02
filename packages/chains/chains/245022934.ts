import type { Chain } from "../src/types";
export default {
  "chain": "Solana",
  "chainId": 245022934,
  "explorers": [
    {
      "name": "neonscan",
      "url": "https://neonscan.org",
      "standard": "EIP3091"
    },
    {
      "name": "native",
      "url": "https://neon.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neonevm.org",
  "name": "Neon EVM MainNet",
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "neonevm-mainnet",
  "slug": "neon-evm",
  "testnet": false
} as const satisfies Chain;