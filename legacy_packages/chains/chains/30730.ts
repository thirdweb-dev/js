import type { Chain } from "../src/types";
export default {
  "chain": "MOVE",
  "chainId": 30730,
  "explorers": [
    {
      "name": "mevm explorer",
      "url": "https://explorer.movementlabs.xyz",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWRAor77N6VyjJiQgtsEE7h9Bd1Q7vtRveTYv2A6wZyAT",
    "width": 1546,
    "height": 1546,
    "format": "png"
  },
  "infoURL": "https://movementlabs.xyz",
  "name": "Movement EVM Legacy",
  "nativeCurrency": {
    "name": "Move",
    "symbol": "MOVE",
    "decimals": 18
  },
  "networkId": 30730,
  "rpc": [],
  "shortName": "moveleg",
  "slug": "movement-evm-legacy",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;