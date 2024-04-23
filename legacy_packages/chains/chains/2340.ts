import type { Chain } from "../src/types";
export default {
  "chain": "Atleta",
  "chainId": 2340,
  "explorers": [
    {
      "name": "Atleta Testnet Explorer",
      "url": "https://polkadot-explorer.atleta.network/#/explorer",
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
    "wss://testnet-rpc.atleta.network:9944"
  ],
  "shortName": "atla",
  "slip44": 1,
  "slug": "atleta-testnet",
  "testnet": true
} as const satisfies Chain;