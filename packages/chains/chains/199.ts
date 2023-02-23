export default {
  "name": "BitTorrent Chain Mainnet",
  "chain": "BTTC",
  "rpc": [
    "https://bittorrent-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bittorrentchain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https://bittorrentchain.io/",
  "shortName": "BTT",
  "chainId": 199,
  "networkId": 199,
  "explorers": [
    {
      "name": "bttcscan",
      "url": "https://scan.bittorrentchain.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bittorrent-chain"
} as const;