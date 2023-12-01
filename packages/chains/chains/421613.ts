import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 421613,
  "explorers": [
    {
      "name": "Arbitrum Goerli Arbiscan",
      "url": "https://goerli.arbiscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://arbitrum.io/",
  "name": "Arbitrum Goerli",
  "nativeCurrency": {
    "name": "Arbitrum Goerli Ether",
    "symbol": "AGOR",
    "decimals": 18
  },
  "networkId": 421613,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://421613.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli-rollup.arbitrum.io/rpc",
    "https://arbitrum-goerli.publicnode.com",
    "wss://arbitrum-goerli.publicnode.com"
  ],
  "shortName": "arb-goerli",
  "slug": "arbitrum-goerli",
  "testnet": true,
  "title": "Arbitrum Goerli Rollup Testnet"
} as const satisfies Chain;