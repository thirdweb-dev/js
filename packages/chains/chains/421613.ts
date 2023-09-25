import type { Chain } from "../src/types";
export default {
  "chainId": 421613,
  "chain": "ETH",
  "name": "Arbitrum Goerli",
  "rpc": [
    "https://arbitrum-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://goerli-rollup.arbitrum.io/rpc",
    "https://arbitrum-goerli.publicnode.com",
    "wss://arbitrum-goerli.publicnode.com"
  ],
  "slug": "arbitrum-goerli",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Arbitrum Goerli Ether",
    "symbol": "AGOR",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io/",
  "shortName": "arb-goerli",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Arbitrum Goerli Rollup Explorer",
      "url": "https://goerli-rollup-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;