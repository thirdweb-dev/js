export default {
  "name": "Findora Forge",
  "chain": "Testnet-forge",
  "rpc": [
    "https://findora-forge.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-forge.prod.findora.org:8545/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "findora-forge",
  "chainId": 2154,
  "networkId": 2154,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-forge.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "findora-forge"
} as const;