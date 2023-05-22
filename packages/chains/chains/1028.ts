import type { Chain } from "../src/types";
export default {
  "name": "BitTorrent Chain Testnet",
  "chain": "BTTC",
  "rpc": [
    "https://bittorrent-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.bittorrentchain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https://bittorrentchain.io/",
  "shortName": "tbtt",
  "chainId": 1028,
  "networkId": 1028,
  "explorers": [
    {
      "name": "testbttcscan",
      "url": "https://testscan.bittorrentchain.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "bittorrent-chain-testnet"
} as const satisfies Chain;