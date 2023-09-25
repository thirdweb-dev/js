import type { Chain } from "../src/types";
export default {
  "chainId": 65010000,
  "chain": "AUT",
  "name": "Autonity Bakerloo (Thames) Testnet",
  "rpc": [
    "https://autonity-bakerloo-thames-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bakerloo.autonity.org/",
    "wss://rpc1.bakerloo.autonity.org/ws/"
  ],
  "slug": "autonity-bakerloo-thames-testnet",
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
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "shortName": "bakerloo-0",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://bakerloo.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;