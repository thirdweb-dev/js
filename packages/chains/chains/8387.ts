import type { Chain } from "../src/types";
export default {
  "chainId": 8387,
  "chain": "FUCK",
  "name": "Dracones Financial Services",
  "rpc": [
    "https://dracones-financial-services.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dracones.net/"
  ],
  "slug": "dracones-financial-services",
  "icon": {
    "url": "ipfs://bafybeibpyckp65pqjvrvqhdt26wqoqk55m6anshbfgyqnaemn6l34nlwya",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Functionally Universal Coin Kind",
    "symbol": "FUCK",
    "decimals": 18
  },
  "infoURL": "https://wolfery.com",
  "shortName": "fuck",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;