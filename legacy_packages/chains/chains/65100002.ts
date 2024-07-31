import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65100002,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qme5nxFZZoNNpiT8u9WwcBot4HyLTg2jxMxRnsbc5voQwB",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://autonity.org/",
  "name": "Autonity Piccadilly (Sumida) Testnet",
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65100002,
  "rpc": [],
  "shortName": "piccadilly-02",
  "slip44": 1,
  "slug": "autonity-piccadilly-sumida-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;