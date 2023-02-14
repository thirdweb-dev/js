export default {
  "name": "Oasis Sapphire",
  "chain": "Sapphire",
  "icon": {
    "url": "ipfs://bafkreiespupb52akiwrexxg7g72mh7m7h7lum5hmqijmpdh3kmuunzclha",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://oasis-sapphire.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sapphire.oasis.io",
    "wss://sapphire.oasis.io/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sapphire Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "shortName": "sapphire",
  "chainId": 23294,
  "networkId": 23294,
  "explorers": [
    {
      "name": "Oasis Sapphire Explorer",
      "url": "https://explorer.sapphire.oasis.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oasis-sapphire"
} as const;