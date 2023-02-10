export default {
  "name": "RSK Mainnet",
  "chain": "RSK",
  "rpc": [
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "infoURL": "https://rsk.co",
  "shortName": "rsk",
  "chainId": 30,
  "networkId": 30,
  "slip44": 137,
  "explorers": [
    {
      "name": "RSK Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rsk"
} as const;