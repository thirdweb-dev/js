import type { Chain } from "../src/types";
export default {
  "chain": "Solana",
  "chainId": 245022929,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neonevm.org/",
  "name": "Neon EVM Devnet Rollup",
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "networkId": 245022929,
  "rpc": [
    "https://245022929.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.rollup.neonevm.org/"
  ],
  "shortName": "neonevm-devnet-rollup",
  "slug": "neon-evm-devnet-rollup",
  "testnet": false
} as const satisfies Chain;