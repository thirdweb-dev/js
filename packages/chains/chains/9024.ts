import type { Chain } from "../src/types";
export default {
  "chain": "Nexa",
  "chainId": 9024,
  "explorers": [
    {
      "name": "Nexablock Explorer",
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
  "faucets": [
    "https://nexablockscan.io/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreib2t2lcaoh6iixrx4gjjvepws5tlsszfla5hb36b3mgyq7clve35y",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://www.nexablock.io/",
  "name": "Nexa Block",
  "nativeCurrency": {
    "name": "Nexa Token",
    "symbol": "NEXB",
    "decimals": 18
  },
  "networkId": 9024,
  "rpc": [
    "https://nexa-block.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet-nodes.nexablockscan.io"
  ],
  "shortName": "Nexa",
  "slug": "nexa-block",
  "testnet": true
} as const satisfies Chain;