import type { Chain } from "../src/types";
export default {
  "chainId": 199,
  "chain": "BTTC",
  "name": "BitTorrent Chain Mainnet",
  "rpc": [
    "https://bittorrent-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bittorrentchain.io/"
  ],
  "slug": "bittorrent-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https:/bt.io",
  "shortName": "BTT",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BitTorrent Chain Explorer",
      "url": "https://bttcscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;