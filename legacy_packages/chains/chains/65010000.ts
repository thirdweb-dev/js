import type { Chain } from "../src/types";
export default {
  "chain": "AUT",
  "chainId": 65010000,
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
  "name": "Autonity Bakerloo (Thames) Testnet",
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65010000,
  "rpc": [],
  "shortName": "bakerloo-0",
  "slip44": 1,
  "slug": "autonity-bakerloo-thames-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;