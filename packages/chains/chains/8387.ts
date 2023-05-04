import type { Chain } from "../src/types";
export default {
  "name": "Dracones Financial Services",
  "title": "The Dracones Mainnet",
  "chain": "FUCK",
  "rpc": [
    "https://dracones-financial-services.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dracones.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Functionally Universal Coin Kind",
    "symbol": "FUCK",
    "decimals": 18
  },
  "infoURL": "https://wolfery.com",
  "shortName": "fuck",
  "chainId": 8387,
  "networkId": 8387,
  "icon": {
    "url": "ipfs://bafybeibpyckp65pqjvrvqhdt26wqoqk55m6anshbfgyqnaemn6l34nlwya",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [],
  "testnet": false,
  "slug": "dracones-financial-services"
} as const satisfies Chain;