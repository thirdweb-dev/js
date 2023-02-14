export default {
  "name": "Stratos Testnet",
  "chain": "STOS",
  "rpc": [
    "https://stratos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-testnet-rpc.thestratos.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "shortName": "stos-testnet",
  "chainId": 2047,
  "networkId": 2047,
  "explorers": [
    {
      "name": "Stratos EVM Explorer (Blockscout)",
      "url": "https://web3-testnet-explorer.thestratos.org",
      "standard": "none"
    },
    {
      "name": "Stratos Cosmos Explorer (BigDipper)",
      "url": "https://big-dipper-dev.thestratos.org",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "stratos-testnet"
} as const;