export default {
  "name": "Posichain Testnet Shard 0",
  "chain": "PSC",
  "rpc": [
    "https://posichain-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.t.posichain.org"
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
  "shortName": "psc-t-s0",
  "chainId": 910000,
  "networkId": 910000,
  "explorers": [
    {
      "name": "Posichain Explorer Testnet",
      "url": "https://explorer-testnet.posichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "posichain-testnet-shard-0"
} as const;