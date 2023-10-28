import type { Chain } from "../src/types";
export default {
  "chain": "FIRE",
  "chainId": 9170,
  "explorers": [],
  "faucets": [
    "https://faucet.thefirechain.com"
  ],
  "icon": {
    "url": "ipfs://QmRnnw2gtbU9TWJMLJ6tks7SN6HQV5rRugeoyN6csTYHt1",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://thefirechain.com",
  "name": "Rinia Testnet Old",
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "networkId": 9170,
  "rpc": [],
  "shortName": "_old_tfire",
  "slug": "rinia-testnet-old",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;