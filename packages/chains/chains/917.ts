import type { Chain } from "../src/types";
export default {
  "chain": "FIRE",
  "chainId": 917,
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
  "name": "Rinia Testnet",
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "networkId": 917,
  "rpc": [
    "https://rinia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://917.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinia.rpc1.thefirechain.com"
  ],
  "shortName": "tfire",
  "slug": "rinia-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;