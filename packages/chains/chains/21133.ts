import type { Chain } from "../src/types";
export default {
  "chain": "AAH",
  "chainId": 21133,
  "explorers": [
    {
      "name": "AAH Blockscout",
      "url": "https://exp.c4ex.net",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmY7HDEj3vnTZzCmenotr48nYyD13R2Fyd5t12R9ARu4wJ",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://t.me/c4eiAirdrop"
  ],
  "infoURL": "https://c4ex.net",
  "name": "All About Healthy",
  "nativeCurrency": {
    "name": "AAH",
    "symbol": "AAH",
    "decimals": 18
  },
  "networkId": 21133,
  "rpc": [
    "https://21133.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.c4ex.net"
  ],
  "shortName": "aah",
  "slug": "all-about-healthy",
  "testnet": false
} as const satisfies Chain;