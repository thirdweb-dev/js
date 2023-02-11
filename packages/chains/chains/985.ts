export default {
  "name": "Memo Smart Chain Mainnet",
  "chain": "MEMO",
  "rpc": [
    "https://memo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.metamemo.one:8501",
    "wss://chain.metamemo.one:16801"
  ],
  "faucets": [
    "https://faucet.metamemo.one/"
  ],
  "nativeCurrency": {
    "name": "Memo",
    "symbol": "CMEMO",
    "decimals": 18
  },
  "infoURL": "www.memolabs.org",
  "shortName": "memochain",
  "chainId": 985,
  "networkId": 985,
  "icon": {
    "url": "ipfs://bafkreig52paynhccs4o5ew6f7mk3xoqu2bqtitmfvlgnwarh2pm33gbdrq",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Memo Mainnet Explorer",
      "url": "https://scan.metamemo.one:8080",
      "icon": "memoscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "memo-smart-chain"
} as const;