export default {
  "name": "Singularity ZERO Mainnet",
  "chain": "ZERO",
  "rpc": [
    "https://singularity-zero.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zerorpc.singularity.gold"
  ],
  "faucets": [
    "https://zeroscan.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "shortName": "ZERO",
  "chainId": 12052,
  "networkId": 12052,
  "slip44": 621,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://zeroscan.singularity.gold",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "singularity-zero"
} as const;