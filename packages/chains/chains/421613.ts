import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 421613,
  "explorers": [
    {
      "name": "Arbitrum Goerli Rollup Explorer",
      "url": "https://goerli-rollup-explorer.arbitrum.io",
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
  "redFlags": [],
  "rpc": [
    "https://arbitrum-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://goerli-rollup.arbitrum.io/rpc",
    "https://arbitrum-goerli.publicnode.com",
    "wss://arbitrum-goerli.publicnode.com"
  ],
  "shortName": "arb-goerli",
  "slug": "arbitrum-goerli",
  "testnet": true
} as const satisfies Chain;