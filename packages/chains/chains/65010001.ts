import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65010001,
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
  "name": "Autonity Bakerloo (Barada) Testnet",
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65010001,
  "rpc": [
    "https://autonity-bakerloo-barada-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://65010001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bakerloo.autonity.org/",
    "wss://rpc1.bakerloo.autonity.org/ws/"
  ],
  "shortName": "bakerloo-01",
  "slug": "autonity-bakerloo-barada-testnet",
  "testnet": true
} as const satisfies Chain;