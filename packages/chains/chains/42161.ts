export default {
  "name": "Arbitrum One",
  "chainId": 42161,
  "shortName": "arb1",
  "chain": "ETH",
  "networkId": 42161,
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://arbitrum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://arb1.arbitrum.io/rpc"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "Arbitrum Explorer",
      "url": "https://explorer.arbitrum.io",
      "standard": "EIP3091"
    },
    {
      "name": "Arbiscan",
      "url": "https://arbiscan.io",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://arbitrum.io",
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
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
  "slug": "arbitrum"
} as const;