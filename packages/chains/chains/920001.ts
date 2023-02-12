export default {
  "name": "Posichain Devnet Shard 1",
  "chain": "PSC",
  "rpc": [
    "https://posichain-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.d.posichain.org"
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
  "shortName": "psc-d-s1",
  "chainId": 920001,
  "networkId": 920001,
  "explorers": [
    {
      "name": "Posichain Explorer Devnet",
      "url": "https://explorer-devnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "posichain-devnet-shard-1"
} as const;