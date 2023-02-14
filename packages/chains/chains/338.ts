export default {
  "name": "Cronos Testnet",
  "chain": "CRO",
  "rpc": [
    "https://cronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-t3.cronos.org"
  ],
  "faucets": [
    "https://cronos.org/faucet"
  ],
  "nativeCurrency": {
    "name": "Cronos Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org",
  "shortName": "tcro",
  "chainId": 338,
  "networkId": 338,
  "explorers": [
    {
      "name": "Cronos Testnet Explorer",
      "url": "https://testnet.cronoscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "cronos-testnet"
} as const;