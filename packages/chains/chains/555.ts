export default {
  "name": "Vela1 Chain Mainnet",
  "chain": "VELA1",
  "rpc": [
    "https://vela1-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.velaverse.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CLASS COIN",
    "symbol": "CLASS",
    "decimals": 18
  },
  "infoURL": "https://velaverse.io",
  "shortName": "CLASS",
  "chainId": 555,
  "networkId": 555,
  "explorers": [
    {
      "name": "Vela1 Chain Mainnet Explorer",
      "url": "https://exp.velaverse.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "vela1-chain"
} as const;