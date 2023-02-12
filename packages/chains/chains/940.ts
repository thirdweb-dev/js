export default {
  "name": "PulseChain Testnet",
  "shortName": "tpls",
  "chain": "tPLS",
  "chainId": 940,
  "networkId": 940,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v2.testnet.pulsechain.com/",
    "wss://rpc.v2.testnet.pulsechain.com/"
  ],
  "faucets": [
    "https://faucet.v2.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "testnet": true,
  "slug": "pulsechain-testnet"
} as const;