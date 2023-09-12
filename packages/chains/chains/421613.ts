import type { Chain } from "../src/types";
export default {
  "name": "Arbitrum Goerli",
  "title": "Arbitrum Goerli Rollup Testnet",
  "chainId": 421613,
  "shortName": "arb-goerli",
  "chain": "ETH",
  "networkId": 421613,
  "nativeCurrency": {
    "name": "Arbitrum Goerli Ether",
    "symbol": "AGOR",
    "decimals": 18
  },
  "rpc": [
    "https://arbitrum-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://goerli-rollup.arbitrum.io/rpc",
    "https://arbitrum-goerli.publicnode.com",
    "wss://arbitrum-goerli.publicnode.com"
  ],
  "faucets": [],
  "infoURL": "https://arbitrum.io/",
  "explorers": [
    {
      "name": "Arbitrum Goerli Rollup Explorer",
      "url": "https://goerli-rollup-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io/"
      }
    ]
  },
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "testnet": true,
  "slug": "arbitrum-goerli"
} as const satisfies Chain;