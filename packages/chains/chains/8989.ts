export default {
  "name": "Giant Mammoth Mainnet",
  "title": "Giant Mammoth Chain",
  "chain": "GMMT",
  "rpc": [
    "https://giant-mammoth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-asia.gmmtchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Giant Mammoth Coin",
    "symbol": "GMMT",
    "decimals": 18
  },
  "infoURL": "https://gmmtchain.io/",
  "shortName": "gmmt",
  "chainId": 8989,
  "networkId": 8989,
  "icon": {
    "url": "ipfs://QmVth4aPeskDTFqRifUugJx6gyEHCmx2PFbMWUtsCSQFkF",
    "width": 468,
    "height": 518,
    "format": "png"
  },
  "explorers": [
    {
      "name": "gmmtscan",
      "url": "https://scan.gmmtchain.io",
      "standard": "EIP3091",
      "icon": "gmmt"
    }
  ],
  "testnet": false,
  "slug": "giant-mammoth"
} as const;