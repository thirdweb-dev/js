export default {
  "name": "Oasis Emerald",
  "chain": "Emerald",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://oasis-emerald.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://emerald.oasis.dev",
    "wss://emerald.oasis.dev/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "shortName": "emerald",
  "chainId": 42262,
  "networkId": 42262,
  "explorers": [
    {
      "name": "Oasis Emerald Explorer",
      "url": "https://explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oasis-emerald"
} as const;