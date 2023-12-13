import type { Chain } from "../src/types";
export default {
  "chain": "Solana",
  "chainId": 245022926,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://neon-devnet.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "neonscan",
      "url": "https://devnet.neonscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://neonfaucet.org"
  ],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neon-labs.org",
  "name": "Neon EVM Devnet",
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "networkId": 245022926,
  "rpc": [
    "https://neon-evm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://245022926.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.neonevm.org"
  ],
  "shortName": "neonevm-devnet",
  "slug": "neon-evm-devnet",
  "testnet": false
} as const satisfies Chain;