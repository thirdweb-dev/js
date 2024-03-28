import type { Chain } from "../src/types";
export default {
  "chain": "Atleta",
  "chainId": 2340,
  "explorers": [
    {
      "name": "Atleta Testnet Explorer",
      "url": "http://185.234.69.18/?rpc=wss%3A%2F%2Fatleta-testnet-rpc.quark.blue%3A9944#/explorer",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmV2JVr4FCcb6aRiUoA3wS5erLoxtLBLonQ1Nvz8fNuEcR",
        "width": 128,
        "height": 128,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.atleta.network"
  ],
  "icon": {
    "url": "ipfs://QmV2JVr4FCcb6aRiUoA3wS5erLoxtLBLonQ1Nvz8fNuEcR",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://atleta.network",
  "name": "Atleta Testnet",
  "nativeCurrency": {
    "name": "Atla",
    "symbol": "ATLA",
    "decimals": 18
  },
  "networkId": 2340,
  "rpc": [
    "https://2340.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://atleta-testnet-rpc.quark.blue:9944"
  ],
  "shortName": "atla",
  "slip44": 1,
  "slug": "atleta-testnet",
  "testnet": true
} as const satisfies Chain;