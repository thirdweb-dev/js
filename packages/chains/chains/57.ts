export default {
  "name": "Syscoin Mainnet",
  "chain": "SYS",
  "rpc": [
    "https://syscoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.syscoin.org",
    "wss://rpc.syscoin.org/wss"
  ],
  "faucets": [
    "https://faucet.syscoin.org"
  ],
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "infoURL": "https://www.syscoin.org",
  "shortName": "sys",
  "chainId": 57,
  "networkId": 57,
  "explorers": [
    {
      "name": "Syscoin Block Explorer",
      "url": "https://explorer.syscoin.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "syscoin"
} as const;