export default {
  "name": "Conflux eSpace",
  "chain": "Conflux",
  "rpc": [
    "https://conflux-espace.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.confluxrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "infoURL": "https://confluxnetwork.org",
  "shortName": "cfx",
  "chainId": 1030,
  "networkId": 1030,
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evm.confluxscan.net",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "conflux-espace"
} as const;