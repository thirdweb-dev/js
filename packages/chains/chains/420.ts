import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 420,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://optimism-goerli.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
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
  "name": "Optimism Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 420,
  "redFlags": [],
  "rpc": [
    "https://optimism-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://420.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.optimism.io",
    "https://optimism-goerli.publicnode.com",
    "wss://optimism-goerli.publicnode.com",
    "https://optimism-goerli.gateway.tenderly.co",
    "wss://optimism-goerli.gateway.tenderly.co"
  ],
  "shortName": "ogor",
  "slip44": 1,
  "slug": "optimism-goerli",
  "testnet": true
} as const satisfies Chain;