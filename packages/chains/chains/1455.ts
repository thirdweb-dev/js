import type { Chain } from "../src/types";
export default {
  "chainId": 1455,
  "chain": "Ctex Scan Blockchain",
  "name": "Ctex Scan Blockchain",
  "rpc": [
    "https://ctex-scan-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ctexscan.com/"
  ],
  "slug": "ctex-scan-blockchain",
  "icon": {
    "url": "ipfs://bafkreid5evn4qovxo6msuekizv5zn7va62tea7w2zpdx5sskconebuhqle",
    "width": 800,
    "height": 800,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ctex Scan Explorer",
      "url": "https://ctexscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;