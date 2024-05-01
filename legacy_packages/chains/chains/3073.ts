import type { Chain } from "../src/types";
export default {
  "chain": "MOVE",
  "chainId": 3073,
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
  "name": "Movement EVM",
  "nativeCurrency": {
    "name": "Move",
    "symbol": "MOVE",
    "decimals": 18
  },
  "networkId": 3073,
  "rpc": [],
  "shortName": "move",
  "slug": "movement-evm",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;