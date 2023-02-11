export default {
  "name": "Kerleano",
  "title": "Proof of Carbon Reduction testnet",
  "chain": "CRC",
  "status": "active",
  "rpc": [
    "https://kerleano.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cacib-saturn-test.francecentral.cloudapp.azure.com",
    "wss://cacib-saturn-test.francecentral.cloudapp.azure.com:9443"
  ],
  "faucets": [
    "https://github.com/ethereum-pocr/kerleano/blob/main/docs/faucet.md"
  ],
  "nativeCurrency": {
    "name": "Carbon Reduction Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/kerleano",
  "shortName": "kerleano",
  "chainId": 1804,
  "networkId": 1804,
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/kerleano",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kerleano"
} as const;