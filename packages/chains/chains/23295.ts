export default {
  "name": "Oasis Sapphire Testnet",
  "chain": "Sapphire",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://oasis-sapphire-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.sapphire.oasis.dev",
    "wss://testnet.sapphire.oasis.dev/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sapphire Test Rose",
    "symbol": "TEST",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "shortName": "sapphire-testnet",
  "chainId": 23295,
  "networkId": 23295,
  "explorers": [
    {
      "name": "Oasis Sapphire Testnet Explorer",
      "url": "https://testnet.explorer.sapphire.oasis.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "oasis-sapphire-testnet"
} as const;