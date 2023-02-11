export default {
  "name": "Binance Smart Chain Mainnet",
  "chain": "BSC",
  "rpc": [
    "https://binance.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://bsc-ws-node.nariox.org",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed4.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed1.binance.org"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "Binance Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.binance.org",
  "shortName": "bnb",
  "chainId": 56,
  "networkId": 56,
  "slip44": 714,
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
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
  "testnet": false,
  "slug": "binance"
} as const;