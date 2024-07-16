import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65010003,
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
  "name": "Autonity Bakerloo (Yamuna) Testnet",
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65010003,
  "rpc": [
    "https://65010003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bakerloo.autonity.org/",
    "wss://rpc1.bakerloo.autonity.org/ws/"
  ],
  "shortName": "bakerloo-03",
  "slip44": 1,
  "slug": "autonity-bakerloo-yamuna-testnet",
  "testnet": true
} as const satisfies Chain;