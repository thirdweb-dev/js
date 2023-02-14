export default {
  "name": "Findora Testnet",
  "chain": "Testnet-anvil",
  "rpc": [
    "https://findora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-testnet.prod.findora.org:8545/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "findora-testnet",
  "chainId": 2153,
  "networkId": 2153,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-anvil.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "findora-testnet"
} as const;