export default {
  "name": "Telos EVM Mainnet",
  "chain": "TLOS",
  "rpc": [
    "https://telos-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.telos.net/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "shortName": "TelosEVM",
  "chainId": 40,
  "networkId": 40,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://teloscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "telos-evm"
} as const;