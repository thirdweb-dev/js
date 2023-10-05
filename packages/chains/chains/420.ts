import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 420,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://optimism-goerli.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://coinbase.com/faucets/optimism-goerli-faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://optimism.io",
  "name": "Optimism Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://optimism-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://optimism-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://goerli.optimism.io",
    "https://optimism-goerli.publicnode.com",
    "wss://optimism-goerli.publicnode.com",
    "https://optimism-goerli.gateway.tenderly.co",
    "wss://optimism-goerli.gateway.tenderly.co"
  ],
  "shortName": "ogor",
  "slug": "optimism-goerli",
  "testnet": true
} as const satisfies Chain;