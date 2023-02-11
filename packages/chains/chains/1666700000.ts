export default {
  "name": "Harmony Testnet Shard 0",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.b.hmny.io"
  ],
  "faucets": [
    "https://faucet.pops.one"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-b-s0",
  "chainId": 1666700000,
  "networkId": 1666700000,
  "explorers": [
    {
      "name": "Harmony Testnet Block Explorer",
      "url": "https://explorer.pops.one",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "harmony-testnet-shard-0"
} as const;