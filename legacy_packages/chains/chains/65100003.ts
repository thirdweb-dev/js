import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65100003,
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
  "name": "Autonity Piccadilly (Yamuna) Testnet",
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65100003,
  "rpc": [
    "https://65100003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/"
  ],
  "shortName": "piccadilly-03",
  "slip44": 1,
  "slug": "autonity-piccadilly-yamuna-testnet",
  "testnet": true
} as const satisfies Chain;