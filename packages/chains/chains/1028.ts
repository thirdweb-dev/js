import type { Chain } from "../src/types";
export default {
  "chainId": 1028,
  "chain": "BTTC",
  "name": "BitTorrent Chain Testnet",
  "rpc": [
    "https://bittorrent-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.bittorrentchain.io/"
  ],
  "slug": "bittorrent-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https://bittorrentchain.io/",
  "shortName": "tbtt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "testbttcscan",
      "url": "https://testscan.bittorrentchain.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;