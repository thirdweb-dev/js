import type { Chain } from "../types";
export default {
  "chain": "Cube",
  "chainId": 1819,
  "explorers": [
    {
      "name": "cubetest-scan",
      "url": "https://testnet.cubescan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.cube.network"
  ],
  "icon": {
    "url": "ipfs://QmbENgHTymTUUArX5MZ2XXH69WGenirU3oamkRD448hYdz",
    "width": 282,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://www.cube.network",
  "name": "Cube Chain Testnet",
  "nativeCurrency": {
    "name": "Cube Chain Test Native Token",
    "symbol": "CUBET",
    "decimals": 18
  },
  "networkId": 1819,
  "rpc": [
    "https://cube-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1819.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.cube.network",
    "wss://ws-testnet.cube.network",
    "https://http-testnet-sg.cube.network",
    "wss://ws-testnet-sg.cube.network",
    "https://http-testnet-jp.cube.network",
    "wss://ws-testnet-jp.cube.network",
    "https://http-testnet-us.cube.network",
    "wss://ws-testnet-us.cube.network"
  ],
  "shortName": "cubet",
  "slip44": 1819,
  "slug": "cube-chain-testnet",
  "testnet": true
} as const satisfies Chain;