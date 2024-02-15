import type { Chain } from "../src/types";
export default {
  "chain": "Nexa Testnet",
  "chainId": 9024,
  "explorers": [
    {
      "name": "Nexablock Testnet Explorer",
      "url": "https://testnet.nexablockscan.io",
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
    "https://testnet.nexablockscan.io/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreib2t2lcaoh6iixrx4gjjvepws5tlsszfla5hb36b3mgyq7clve35y",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://www.nexablock.io",
  "name": "Nexa Testnet Block",
  "nativeCurrency": {
    "name": "Nexa Testnet Token",
    "symbol": "NEXB",
    "decimals": 18
  },
  "networkId": 9024,
  "rpc": [
    "https://nexa-testnet-block.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet-nodes.nexablockscan.io"
  ],
  "shortName": "NexaTestnet",
  "slug": "nexa-testnet-block",
  "testnet": true
} as const satisfies Chain;