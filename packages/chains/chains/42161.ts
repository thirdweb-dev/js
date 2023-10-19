import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 42161,
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
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum One",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://arb1.arbitrum.io/rpc",
    "https://arbitrum-one.publicnode.com",
    "wss://arbitrum-one.publicnode.com"
  ],
  "shortName": "arb1",
  "slug": "arbitrum",
  "testnet": false
} as const satisfies Chain;