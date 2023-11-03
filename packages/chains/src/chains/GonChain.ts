import type { Chain } from "../types";
export default {
  "chain": "GonChain",
  "chainId": 10024,
  "explorers": [
    {
      "name": "Gon Explorer",
      "url": "https://gonscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPtiJGaApbW3ATZhPW3pKJpw3iGVrRGsZLWhrDKF9ZK18",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "name": "Gon Chain",
  "nativeCurrency": {
    "name": "Gon Token",
    "symbol": "GT",
    "decimals": 18
  },
  "networkId": 10024,
  "rpc": [
    "https://gon-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.gaiaopen.network",
    "https://node1.mainnet.gon.network",
    "https://node2.mainnet.gon.network",
    "https://node3.mainnet.gon.network",
    "https://node4.mainnet.gon.network"
  ],
  "shortName": "gon",
  "slug": "gon-chain",
  "testnet": true
} as const satisfies Chain;