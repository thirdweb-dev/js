export default {
  "name": "Pixie Chain Mainnet",
  "chain": "PixieChain",
  "rpc": [
    "https://http-mainnet.chain.pixie.xyz",
    "wss://ws-mainnet.chain.pixie.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pixie Chain Native Token",
    "symbol": "PIX",
    "decimals": 18
  },
  "infoURL": "https://chain.pixie.xyz",
  "shortName": "pixie-chain",
  "chainId": 6626,
  "networkId": 6626,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.chain.pixie.xyz",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "pixie-chain"
} as const;