import type { Chain } from "../src/types";
export default {
  "chain": "HYDRA",
  "chainId": 4488,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmVxyUjuA8t9q3oWDgv8ExqaUXcRuDqiKrZAiLaBWHYcmG",
    "width": 722,
    "height": 813,
    "format": "png"
  },
  "infoURL": "https://hydrachain.org",
  "name": "Hydra Chain",
  "nativeCurrency": {
    "name": "Hydra",
    "symbol": "HYDRA",
    "decimals": 18
  },
  "networkId": 4488,
  "rpc": [],
  "shortName": "HYDRA",
  "slug": "hydra-chain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;