export default {
  "name": "CMP-Mainnet",
  "chain": "CMP",
  "rpc": [
    "https://cmp.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.block.caduceus.foundation",
    "wss://mainnet.block.caduceus.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Caduceus Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "infoURL": "https://caduceus.foundation/",
  "shortName": "cmp-mainnet",
  "chainId": 256256,
  "networkId": 256256,
  "explorers": [
    {
      "name": "Mainnet Scan",
      "url": "https://mainnet.scan.caduceus.foundation",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "cmp"
} as const;