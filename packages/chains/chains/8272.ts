import type { Chain } from "../src/types";
export default {
  "chainId": 8272,
  "chain": "Blockton Blockchain",
  "name": "Blockton Blockchain",
  "rpc": [
    "https://blockton-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blocktonscan.com/"
  ],
  "slug": "blockton-blockchain",
  "icon": {
    "url": "ipfs://bafkreig3hoedafisrgc6iffdo2jcblm6kov35h72gcblc3zkmt7t4ucwhy",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [
    "https://faucet.blocktonscan.com/"
  ],
  "nativeCurrency": {
    "name": "BLOCKTON",
    "symbol": "BTON",
    "decimals": 18
  },
  "infoURL": "https://blocktoncoin.com",
  "shortName": "BTON",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockton Explorer",
      "url": "https://blocktonscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;