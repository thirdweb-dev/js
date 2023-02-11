export default {
  "name": "Singularity ZERO Testnet",
  "chain": "ZERO",
  "rpc": [
    "https://singularity-zero-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://betaenv.singularity.gold:18545"
  ],
  "faucets": [
    "https://nft.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "tZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "shortName": "tZERO",
  "chainId": 12051,
  "networkId": 12051,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://betaenv.singularity.gold:18002",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "singularity-zero-testnet"
} as const;