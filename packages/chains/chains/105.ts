export default {
  "name": "Web3Games Devnet",
  "chain": "Web3Games",
  "icon": {
    "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [
    "https://web3games-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.web3games.org/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "infoURL": "https://web3games.org/",
  "shortName": "dw3g",
  "chainId": 105,
  "networkId": 105,
  "explorers": [
    {
      "name": "Web3Games Explorer",
      "url": "https://explorer-devnet.web3games.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "web3games-devnet"
} as const;