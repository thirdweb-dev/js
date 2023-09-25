import type { Chain } from "../src/types";
export default {
  "chainId": 65100000,
  "chain": "AUT",
  "name": "Autonity Piccadilly (Thames) Testnet",
  "rpc": [
    "https://autonity-piccadilly-thames-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/"
  ],
  "slug": "autonity-piccadilly-thames-testnet",
  "icon": {
    "url": "ipfs://Qme5nxFZZoNNpiT8u9WwcBot4HyLTg2jxMxRnsbc5voQwB",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "shortName": "piccadilly-0",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;