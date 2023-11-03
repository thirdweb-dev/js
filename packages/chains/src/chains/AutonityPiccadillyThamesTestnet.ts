import type { Chain } from "../types";
export default {
  "chain": "AUT",
  "chainId": 65100000,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
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
  "name": "Autonity Piccadilly (Thames) Testnet",
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65100000,
  "rpc": [
    "https://autonity-piccadilly-thames-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://65100000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/"
  ],
  "shortName": "piccadilly-0",
  "slug": "autonity-piccadilly-thames-testnet",
  "testnet": true
} as const satisfies Chain;