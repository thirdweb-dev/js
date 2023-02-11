export default {
  "name": "Posichain Devnet Shard 0",
  "chain": "PSC",
  "rpc": [
    "https://posichain-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.d.posichain.org"
  ],
  "faucets": [
    "https://faucet.posichain.org/"
  ],
  "nativeCurrency": {
    "name": "Posichain Native Token",
    "symbol": "POSI",
    "decimals": 18
  },
  "infoURL": "https://posichain.org",
  "shortName": "psc-d-s0",
  "chainId": 920000,
  "networkId": 920000,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "posichain-devnet-shard-0"
} as const;