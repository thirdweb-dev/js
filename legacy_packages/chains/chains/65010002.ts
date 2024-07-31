import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65010002,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://bakerloo.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "icon": {
    "url": "ipfs://Qme5nxFZZoNNpiT8u9WwcBot4HyLTg2jxMxRnsbc5voQwB",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://autonity.org/",
  "name": "Autonity Bakerloo (Sumida) Testnet",
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65010002,
  "rpc": [],
  "shortName": "bakerloo-02",
  "slip44": 1,
  "slug": "autonity-bakerloo-sumida-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;