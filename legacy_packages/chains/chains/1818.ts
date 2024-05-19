import type { Chain } from "../src/types";
export default {
  "chain": "Cube",
  "chainId": 1818,
  "explorers": [
    {
      "name": "cube-scan",
      "url": "https://cubescan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.cube.network",
  "name": "Cube Chain Mainnet",
  "nativeCurrency": {
    "name": "Cube Chain Native Token",
    "symbol": "CUBE",
    "decimals": 18
  },
  "networkId": 1818,
  "rpc": [
    "https://1818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.cube.network",
    "wss://ws-mainnet.cube.network",
    "https://http-mainnet-sg.cube.network",
    "wss://ws-mainnet-sg.cube.network",
    "https://http-mainnet-us.cube.network",
    "wss://ws-mainnet-us.cube.network"
  ],
  "shortName": "cube",
  "slip44": 1818,
  "slug": "cube-chain",
  "testnet": false
} as const satisfies Chain;