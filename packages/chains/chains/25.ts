export default {
  "name": "Cronos Mainnet Beta",
  "chain": "CRO",
  "rpc": [
    "https://cronos-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cronos.org"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org/",
  "shortName": "cro",
  "chainId": 25,
  "networkId": 25,
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://cronoscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cronos-beta"
} as const;