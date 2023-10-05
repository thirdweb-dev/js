import type { Chain } from "../src/types";
export default {
  "chain": "BTTC",
  "chainId": 1028,
  "explorers": [
    {
      "name": "testbttcscan",
      "url": "https://testscan.bittorrentchain.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://bittorrentchain.io/",
  "name": "BitTorrent Chain Testnet",
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bittorrent-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.bittorrentchain.io/"
  ],
  "shortName": "tbtt",
  "slug": "bittorrent-chain-testnet",
  "testnet": true
} as const satisfies Chain;