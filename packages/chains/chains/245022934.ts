import type { Chain } from "../src/types";
export default {
  "chainId": 245022934,
  "chain": "Solana",
  "name": "Neon EVM MainNet",
  "rpc": [],
  "slug": "neon-evm",
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonevm.org",
  "shortName": "neonevm-mainnet",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;