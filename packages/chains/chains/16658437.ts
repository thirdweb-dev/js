export default {
  "name": "Plian Testnet Main",
  "chain": "Plian",
  "rpc": [
    "https://plian-testnet-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Testnet Token",
    "symbol": "TPI",
    "decimals": 18
  },
  "infoURL": "https://plian.org",
  "shortName": "plian-testnet",
  "chainId": 16658437,
  "networkId": 16658437,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "plian-testnet-main"
} as const;