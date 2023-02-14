export default {
  "name": "Diode Testnet Staging",
  "chain": "DIODE",
  "rpc": [
    "https://diode-testnet-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Staging Diodes",
    "symbol": "sDIODE",
    "decimals": 18
  },
  "infoURL": "https://diode.io/staging",
  "shortName": "dstg",
  "chainId": 13,
  "networkId": 13,
  "testnet": true,
  "slug": "diode-testnet-staging"
} as const;