import type { Chain } from "../src/types";
export default {
  "name": "Cube Chain Testnet",
  "chain": "Cube",
  "icon": {
    "url": "ipfs://QmbENgHTymTUUArX5MZ2XXH69WGenirU3oamkRD448hYdz",
    "width": 282,
    "height": 250,
    "format": "png"
  },
  "rpc": [],
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
  "chainId": 1819,
  "networkId": 1819,
  "slip44": 1819,
  "explorers": [
    {
      "name": "cubetest-scan",
      "url": "https://testnet.cubescan.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "cube-chain-testnet"
} as const satisfies Chain;