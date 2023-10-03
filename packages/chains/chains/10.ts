import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 10,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://optimistic.etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://optimism.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://optimism.io",
  "name": "OP Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://optimism.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://mainnet.optimism.io",
    "https://optimism.publicnode.com",
    "wss://optimism.publicnode.com",
    "https://optimism.gateway.tenderly.co",
    "wss://optimism.gateway.tenderly.co"
  ],
  "shortName": "oeth",
  "slug": "optimism",
  "testnet": false
} as const satisfies Chain;