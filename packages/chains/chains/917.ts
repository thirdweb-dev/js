export default {
  "name": "Rinia Testnet",
  "chain": "FIRE",
  "icon": {
    "url": "ipfs://QmRnnw2gtbU9TWJMLJ6tks7SN6HQV5rRugeoyN6csTYHt1",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://rinia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinia.rpc1.thefirechain.com"
  ],
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
  "chainId": 917,
  "networkId": 917,
  "explorers": [],
  "status": "incubating",
  "testnet": true,
  "slug": "rinia-testnet"
} as const;