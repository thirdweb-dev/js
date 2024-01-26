import type { Chain } from "../src/types";
export default {
  "chain": "MYTH",
  "chainId": 201804,
  "explorers": [
    {
      "name": "Mythical Chain Explorer",
      "url": "https://explorer.mythicalgames.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreihru6cccfblrjz5bv36znq2l3h67u6xj5ivtc4bj5l6gzofbgtnb4",
        "width": 350,
        "height": 350,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreihru6cccfblrjz5bv36znq2l3h67u6xj5ivtc4bj5l6gzofbgtnb4",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "infoURL": "https://mythicalgames.com/",
  "name": "Mythical Chain",
  "nativeCurrency": {
    "name": "Mythos",
    "symbol": "MYTH",
    "decimals": 18
  },
  "networkId": 201804,
  "rpc": [
    "https://mythical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://201804.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.mythicalgames.com"
  ],
  "shortName": "myth",
  "slug": "mythical-chain",
  "testnet": false
} as const satisfies Chain;