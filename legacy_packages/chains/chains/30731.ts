import type { Chain } from "../src/types";
export default {
  "chain": "MOVE",
  "chainId": 336,
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
  "name": "Movement EVM Devnet",
  "nativeCurrency": {
    "name": "Move",
    "symbol": "MOVE",
    "decimals": 18
  },
  "networkId": 336,
  "rpc": [
    "https://mevm.devnet.m1.movementlabs.xyz"
  ],
  "shortName": "movedev",
  "slug": "movement-evm-devnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;
