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
  "infoURL": "https://autonity.org/",
  "name": "Autonity Bakerloo (Barada) Testnet",
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65010001,
  "rpc": [],
  "shortName": "bakerloo-01",
  "slip44": 1,
  "slug": "autonity-bakerloo-barada-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;