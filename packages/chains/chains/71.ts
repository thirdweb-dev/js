export default {
  "name": "Conflux eSpace (Testnet)",
  "chain": "Conflux",
  "rpc": [
    "https://evmtestnet.confluxrpc.com"
  ],
  "faucets": [
    "https://faucet.confluxnetwork.org"
  ],
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "infoURL": "https://confluxnetwork.org",
  "shortName": "cfxtest",
  "chainId": 71,
  "networkId": 71,
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evmtestnet.confluxscan.net",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "conflux-espace-testnet"
} as const;