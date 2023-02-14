export default {
  "name": "Binance Smart Chain Testnet",
  "chain": "BSC",
  "rpc": [
    "https://binance-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-seed-prebsc-2-s3.binance.org:8545",
    "https://data-seed-prebsc-1-s3.binance.org:8545",
    "https://data-seed-prebsc-2-s2.binance.org:8545",
    "https://data-seed-prebsc-1-s2.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  ],
  "faucets": [
    "https://testnet.binance.org/faucet-smart"
  ],
  "nativeCurrency": {
    "name": "Binance Chain Native Token",
    "symbol": "tBNB",
    "decimals": 18
  },
  "infoURL": "https://testnet.binance.org/",
  "shortName": "bnbt",
  "chainId": 97,
  "networkId": 97,
  "explorers": [
    {
      "name": "bscscan-testnet",
      "url": "https://testnet.bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/binance-coin/512.png",
    "height": 512,
    "width": 512,
    "format": "png",
    "sizes": [
      512,
      256,
      128,
      64,
      32,
      16
    ]
  },
  "testnet": true,
  "slug": "binance-testnet"
} as const;