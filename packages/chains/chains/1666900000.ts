export default {
  "name": "Harmony Devnet Shard 0",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.ps.hmny.io"
  ],
  "faucets": [
    "http://dev.faucet.easynode.one/"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-ps-s0",
  "chainId": 1666900000,
  "networkId": 1666900000,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.ps.hmny.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "harmony-devnet-shard-0"
} as const;