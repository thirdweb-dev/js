export default {
  "name": "KCC Testnet",
  "chain": "KCC",
  "rpc": [
    "https://kcc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.kcc.network"
  ],
  "faucets": [
    "https://faucet-testnet.kcc.network"
  ],
  "nativeCurrency": {
    "name": "KuCoin Testnet Token",
    "symbol": "tKCS",
    "decimals": 18
  },
  "infoURL": "https://scan-testnet.kcc.network",
  "shortName": "kcst",
  "chainId": 322,
  "networkId": 322,
  "explorers": [
    {
      "name": "kcc-scan-testnet",
      "url": "https://scan-testnet.kcc.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kcc-testnet"
} as const;