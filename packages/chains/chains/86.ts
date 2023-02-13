export default {
  "name": "GateChain Mainnet",
  "chainId": 86,
  "shortName": "gt",
  "chain": "GT",
  "networkId": 86,
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "rpc": [
    "https://gatechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.gatenode.cc"
  ],
  "faucets": [
    "https://www.gatescan.org/faucet"
  ],
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://www.gatechain.io",
  "testnet": false,
  "slug": "gatechain"
} as const;