import type { Chain } from "../src/types";
export default {
  "chain": "Nexa Mainnet",
  "chainId": 9025,
  "explorers": [
    {
      "name": "Nexablock Mainnet Explorer",
      "url": "https://nexablockscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreib2t2lcaoh6iixrx4gjjvepws5tlsszfla5hb36b3mgyq7clve35y",
        "width": 192,
        "height": 192,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreib2t2lcaoh6iixrx4gjjvepws5tlsszfla5hb36b3mgyq7clve35y",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://www.nexablock.io",
  "name": "Nexa Mainnet Block",
  "nativeCurrency": {
    "name": "Nexa Mainnet Token",
    "symbol": "NEXB",
    "decimals": 18
  },
  "networkId": 9025,
  "rpc": [
    "https://nexa-block.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9025.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-nodes.nexablockscan.io"
  ],
  "shortName": "Nexa",
  "slug": "nexa-block",
  "testnet": false
} as const satisfies Chain;