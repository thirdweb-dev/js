import type { Chain } from "../src/types";
export default {
  "name": "Neon EVM MainNet",
  "chain": "Solana",
  "rpc": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonevm.org",
  "shortName": "neonevm-mainnet",
  "chainId": 245022934,
  "networkId": 245022934,
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
  "testnet": false,
  "slug": "neon-evm"
} as const satisfies Chain;