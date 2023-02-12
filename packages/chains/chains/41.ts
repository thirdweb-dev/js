export default {
  "name": "Telos EVM Testnet",
  "chain": "TLOS",
  "rpc": [
    "https://telos-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.telos.net/evm"
  ],
  "faucets": [
    "https://app.telos.net/testnet/developers"
  ],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "shortName": "TelosEVMTestnet",
  "chainId": 41,
  "networkId": 41,
  "testnet": true,
  "slug": "telos-evm-testnet"
} as const;