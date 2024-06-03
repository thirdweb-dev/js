import type { Chain } from "../src/types";
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
  "infoURL": "https://autonity.org/",
  "name": "Autonity Piccadilly (Thames) Testnet",
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "networkId": 65100000,
  "rpc": [],
  "shortName": "piccadilly-0",
  "slip44": 1,
  "slug": "autonity-piccadilly-thames-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;