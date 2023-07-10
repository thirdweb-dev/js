import type { Chain } from "../src/types";
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
  "infoURL": "https:/bt.io",
  "shortName": "BTT",
  "chainId": 199,
  "networkId": 199,
  "explorers": [
    {
      "name": "BitTorrent Chain Explorer",
      "url": "https://bttcscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bittorrent-chain"
} as const satisfies Chain;