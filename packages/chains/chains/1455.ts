import type { Chain } from "../src/types";
export default {
  "chain": "Ctex Scan Blockchain",
  "chainId": 1455,
  "explorers": [
    {
      "name": "Ctex Scan Explorer",
      "url": "https://ctexscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.ctexscan.com"
  ],
  "icon": {
    "url": "ipfs://bafkreid5evn4qovxo6msuekizv5zn7va62tea7w2zpdx5sskconebuhqle",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://ctextoken.io",
  "name": "Ctex Scan Blockchain",
  "nativeCurrency": {
    "name": "CTEX",
    "symbol": "CTEX",
    "decimals": 18
  },
  "networkId": 1455,
  "rpc": [
    "https://ctex-scan-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1455.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ctexscan.com/"
  ],
  "shortName": "CTEX",
  "slug": "ctex-scan-blockchain",
  "testnet": false
} as const satisfies Chain;