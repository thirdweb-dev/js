import type { Chain } from "../src/types";
export default {
  "chainId": 420,
  "chain": "ETH",
  "name": "Optimism Goerli Testnet",
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
  "slug": "optimism-goerli",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://coinbase.com/faucets/optimism-goerli-faucet"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optimism.io",
  "shortName": "ogor",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://optimism-goerli.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;