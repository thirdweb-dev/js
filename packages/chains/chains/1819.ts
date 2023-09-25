import type { Chain } from "../src/types";
export default {
  "chainId": 1819,
  "chain": "Cube",
  "name": "Cube Chain Testnet",
  "rpc": [
    "https://cube-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.cube.network",
    "wss://ws-testnet.cube.network",
    "https://http-testnet-sg.cube.network",
    "wss://ws-testnet-sg.cube.network",
    "https://http-testnet-jp.cube.network",
    "wss://ws-testnet-jp.cube.network",
    "https://http-testnet-us.cube.network",
    "wss://ws-testnet-us.cube.network"
  ],
  "slug": "cube-chain-testnet",
  "icon": {
    "url": "ipfs://QmbENgHTymTUUArX5MZ2XXH69WGenirU3oamkRD448hYdz",
    "width": 282,
    "height": 250,
    "format": "png"
  },
  "faucets": [
    "https://faucet.cube.network"
  ],
  "nativeCurrency": {
    "name": "Cube Chain Test Native Token",
    "symbol": "CUBET",
    "decimals": 18
  },
  "infoURL": "https://www.cube.network",
  "shortName": "cubet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "cubetest-scan",
      "url": "https://testnet.cubescan.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;