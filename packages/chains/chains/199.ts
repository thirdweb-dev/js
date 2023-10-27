import type { Chain } from "../src/types";
export default {
  "chain": "BTTC",
  "chainId": 199,
  "explorers": [
    {
      "name": "BitTorrent Chain Explorer",
      "url": "https://bttcscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https:/bt.io",
  "name": "BitTorrent Chain Mainnet",
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "networkId": 199,
  "rpc": [
    "https://bittorrent-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://199.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bittorrentchain.io/"
  ],
  "shortName": "BTT",
  "slug": "bittorrent-chain",
  "testnet": false
} as const satisfies Chain;