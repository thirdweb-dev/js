export default {
  "name": "Nebula Staging",
  "chain": "staging-faint-slimy-achird",
  "rpc": [
    "https://nebula-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "shortName": "nebula-staging",
  "chainId": 503129905,
  "networkId": 503129905,
  "explorers": [
    {
      "name": "nebula",
      "url": "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
      "icon": "nebula",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "nebula-staging"
} as const;