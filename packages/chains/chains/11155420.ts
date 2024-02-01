import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 11155420,
  "explorers": [
    {
      "name": "opscout",
      "url": "https://optimism-sepolia.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://app.optimism.io/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://optimism.io",
  "name": "OP Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 11155420,
  "redFlags": [],
  "rpc": [
    "https://op-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11155420.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.optimism.io"
  ],
  "shortName": "opsep",
  "slip44": 1,
  "slug": "op-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;