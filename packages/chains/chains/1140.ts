export default {
  "name": "MathChain Testnet",
  "chain": "MATH",
  "rpc": [
    "https://mathchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galois-hk.maiziqianbao.net/rpc"
  ],
  "faucets": [
    "https://scan.boka.network/#/Galois/faucet"
  ],
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "infoURL": "https://mathchain.org",
  "shortName": "tMATH",
  "chainId": 1140,
  "networkId": 1140,
  "testnet": true,
  "slug": "mathchain-testnet"
} as const;