export default {
  "name": "DxChain Testnet",
  "chain": "DxChain",
  "rpc": [
    "https://dxchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-http.dxchain.com"
  ],
  "faucets": [
    "https://faucet.dxscan.io"
  ],
  "nativeCurrency": {
    "name": "DxChain Testnet",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://testnet.dxscan.io/",
  "shortName": "dxc",
  "chainId": 72,
  "networkId": 72,
  "testnet": true,
  "slug": "dxchain-testnet"
} as const;