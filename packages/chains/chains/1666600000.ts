export default {
  "name": "Harmony Mainnet Shard 0",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.harmony.one",
    "https://api.s0.t.hmny.io"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-s0",
  "chainId": 1666600000,
  "networkId": 1666600000,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "harmony-shard-0"
} as const;