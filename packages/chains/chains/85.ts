export default {
  "name": "GateChain Testnet",
  "chainId": 85,
  "shortName": "gttest",
  "chain": "GTTEST",
  "networkId": 85,
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "rpc": [
    "https://gatechain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gatenode.cc"
  ],
  "faucets": [
    "https://www.gatescan.org/testnet/faucet"
  ],
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://www.gatechain.io",
  "testnet": true,
  "slug": "gatechain-testnet"
} as const;