export default {
  "name": "Syscoin Rollux Testnet",
  "chain": "SYS",
  "rpc": [
    "https://syscoin-rollux-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-tanenbaum.rollux.com",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rollux Testnet Syscoin",
    "symbol": "tSYS",
    "decimals": 18
  },
  "infoURL": "https://syscoin.org",
  "shortName": "tsys-rollux",
  "chainId": 57000,
  "networkId": 57000,
  "explorers": [
    {
      "name": "Syscoin Rollux Testnet Explorer",
      "url": "https://rollux.tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "syscoin-rollux-testnet"
} as const;