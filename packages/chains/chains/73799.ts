export default {
  "name": "Energy Web Volta Testnet",
  "chain": "Volta",
  "rpc": [
    "https://energy-web-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://volta-rpc.energyweb.org",
    "wss://volta-rpc.energyweb.org/ws"
  ],
  "faucets": [
    "https://voltafaucet.energyweb.org"
  ],
  "nativeCurrency": {
    "name": "Volta Token",
    "symbol": "VT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "shortName": "vt",
  "chainId": 73799,
  "networkId": 73799,
  "testnet": true,
  "slug": "energy-web-volta-testnet"
} as const;