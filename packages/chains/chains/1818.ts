import type { Chain } from "../src/types";
export default {
  "chainId": 1818,
  "chain": "Cube",
  "name": "Cube Chain Mainnet",
  "rpc": [
    "https://cube-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.cube.network",
    "wss://ws-mainnet.cube.network",
    "https://http-mainnet-sg.cube.network",
    "wss://ws-mainnet-sg.cube.network",
    "https://http-mainnet-us.cube.network",
    "wss://ws-mainnet-us.cube.network"
  ],
  "slug": "cube-chain",
  "icon": {
    "url": "ipfs://QmbENgHTymTUUArX5MZ2XXH69WGenirU3oamkRD448hYdz",
    "width": 282,
    "height": 250,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Cube Chain Native Token",
    "symbol": "CUBE",
    "decimals": 18
  },
  "infoURL": "https://www.cube.network",
  "shortName": "cube",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "cube-scan",
      "url": "https://cubescan.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;