import type { Chain } from "../src/types";
export default {
  "chainId": 917,
  "chain": "FIRE",
  "name": "Rinia Testnet",
  "rpc": [
    "https://rinia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinia.rpc1.thefirechain.com"
  ],
  "slug": "rinia-testnet",
  "icon": {
    "url": "ipfs://QmRnnw2gtbU9TWJMLJ6tks7SN6HQV5rRugeoyN6csTYHt1",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.thefirechain.com"
  ],
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "infoURL": "https://thefirechain.com",
  "shortName": "tfire",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;