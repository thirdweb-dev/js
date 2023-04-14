import type { Chain } from "../src/types";
export default {
  "name": "Ctex Scan Blockchain",
  "chain": "Ctex Scan Blockchain",
  "icon": {
    "url": "ipfs://bafkreid5evn4qovxo6msuekizv5zn7va62tea7w2zpdx5sskconebuhqle",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://ctex-scan-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ctexscan.com/"
  ],
  "faucets": [
    "https://faucet.ctexscan.com"
  ],
  "nativeCurrency": {
    "name": "CTEX",
    "symbol": "CTEX",
    "decimals": 18
  },
  "infoURL": "https://ctextoken.io",
  "shortName": "CTEX",
  "chainId": 1455,
  "networkId": 1455,
  "explorers": [
    {
      "name": "Ctex Scan Explorer",
      "url": "https://ctexscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ctex-scan-blockchain"
} as const satisfies Chain;