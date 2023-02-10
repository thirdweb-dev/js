export default {
  "name": "Freight Trust Network",
  "chain": "EDI",
  "rpc": [
    "http://13.57.207.168:3435",
    "https://app.freighttrust.net/ftn/${API_KEY}"
  ],
  "faucets": [
    "http://faucet.freight.sh"
  ],
  "nativeCurrency": {
    "name": "Freight Trust Native",
    "symbol": "0xF",
    "decimals": 18
  },
  "infoURL": "https://freighttrust.com",
  "shortName": "EDI",
  "chainId": 211,
  "networkId": 0,
  "testnet": false,
  "slug": "freight-trust-network"
} as const;