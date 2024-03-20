import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65100001,
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
  "name": "Autonity Piccadilly (Barada) Testnet",
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65100001,
  "rpc": [],
  "shortName": "piccadilly-01",
  "slip44": 1,
  "slug": "autonity-piccadilly-barada-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;