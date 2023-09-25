import type { Chain } from "../src/types";
export default {
  "chainId": 10024,
  "chain": "GonChain",
  "name": "Gon Chain",
  "rpc": [
    "https://gon-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.gaiaopen.network",
    "https://node1.mainnet.gon.network",
    "https://node2.mainnet.gon.network",
    "https://node3.mainnet.gon.network",
    "https://node4.mainnet.gon.network"
  ],
  "slug": "gon-chain",
  "icon": {
    "url": "ipfs://QmPtiJGaApbW3ATZhPW3pKJpw3iGVrRGsZLWhrDKF9ZK18",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Gon Token",
    "symbol": "GT",
    "decimals": 18
  },
  "shortName": "gon",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Gon Explorer",
      "url": "https://gonscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;