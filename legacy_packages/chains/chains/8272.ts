import type { Chain } from "../src/types";
export default {
  "chain": "Blockton Blockchain",
  "chainId": 8272,
  "explorers": [
    {
      "name": "Blockton Explorer",
      "url": "https://blocktonscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.blocktonscan.com/"
  ],
  "icon": {
    "url": "ipfs://bafkreig3hoedafisrgc6iffdo2jcblm6kov35h72gcblc3zkmt7t4ucwhy",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://blocktoncoin.com",
  "name": "Blockton Blockchain",
  "nativeCurrency": {
    "name": "BLOCKTON",
    "symbol": "BTON",
    "decimals": 18
  },
  "networkId": 8272,
  "rpc": [
    "https://8272.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blocktonscan.com/"
  ],
  "shortName": "BTON",
  "slug": "blockton-blockchain",
  "testnet": false
} as const satisfies Chain;