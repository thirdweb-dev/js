export default {
  "name": "Oasis Emerald Testnet",
  "chain": "Emerald",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://oasis-emerald-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.emerald.oasis.dev/",
    "wss://testnet.emerald.oasis.dev/ws"
  ],
  "faucets": [
    "https://faucet.testnet.oasis.dev/"
  ],
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "shortName": "emerald-testnet",
  "chainId": 42261,
  "networkId": 42261,
  "explorers": [
    {
      "name": "Oasis Emerald Testnet Explorer",
      "url": "https://testnet.explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "oasis-emerald-testnet"
} as const;