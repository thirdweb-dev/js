import type { Chain } from "../src/types";
export default {
  "chain": "HMV",
  "chainId": 40875,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.testnet.oasys.homeverse.games/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXjuxNhhcTyKq6ens4xQwu2kCHXYWfYZY6FYUqDeDNQR4",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXjuxNhhcTyKq6ens4xQwu2kCHXYWfYZY6FYUqDeDNQR4",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "name": "Oasys Homeverse Testnet",
  "nativeCurrency": {
    "name": "Homeverse OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 40875,
  "redFlags": [],
  "rpc": [
    "https://40875.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.oasys.homeverse.games"
  ],
  "shortName": "HMV",
  "slug": "oasys-homeverse-testnet",
  "testnet": true
} as const satisfies Chain;