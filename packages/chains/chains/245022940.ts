export default {
  "name": "Neon EVM TestNet",
  "chain": "Solana",
  "rpc": [
    "https://neon-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonevm.org"
  ],
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
  "infoURL": "https://neon-labs.org",
  "shortName": "neonevm-testnet",
  "chainId": 245022940,
  "networkId": 245022940,
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
  "testnet": true,
  "slug": "neon-evm-testnet"
} as const;