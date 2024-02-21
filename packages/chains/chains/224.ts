import type { Chain } from "../src/types";
export default {
  "chain": "VRD",
  "chainId": 224,
  "explorers": [
    {
      "name": "Viridis Testnet",
      "url": "https://testnet.vrd.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vrd.network"
  ],
  "icon": {
    "url": "ipfs://QmPdxcJwPogfZdec7UAqxeatRxrivEktpP1ftJBTeJQTdR",
    "width": 3000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://viridis.network",
  "name": "Viridis Testnet",
  "nativeCurrency": {
    "name": "Viridis Token",
    "symbol": "VRD",
    "decimals": 18
  },
  "networkId": 224,
  "rpc": [
    "https://224.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.vrd.network"
  ],
  "shortName": "VRD-Testnet",
  "slug": "viridis-testnet",
  "testnet": true
} as const satisfies Chain;