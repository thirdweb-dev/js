import type { Chain } from "../src/types";
export default {
  "chain": "Vizing Mainnet",
  "chainId": 28518,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.vizing.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPgpWfGsAZ5UHekWFR8rioadVe3Wox8idFyeVxuv9N4Vo",
        "width": 200,
        "height": 200,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPgpWfGsAZ5UHekWFR8rioadVe3Wox8idFyeVxuv9N4Vo",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://vizing.com",
  "name": "Vizing Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28518,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.vizing.com"
      }
    ]
  },
  "rpc": [
    "https://28518.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.vizing.com"
  ],
  "shortName": "Vizing",
  "slug": "vizing",
  "testnet": false,
  "title": "Vizing Mainnet"
} as const satisfies Chain;