export default {
  "name": "PulseChain Mainnet",
  "shortName": "pls",
  "chain": "PLS",
  "chainId": 369,
  "networkId": 369,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.pulsechain.com/",
    "wss://rpc.mainnet.pulsechain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "testnet": false,
  "slug": "pulsechain"
} as const;