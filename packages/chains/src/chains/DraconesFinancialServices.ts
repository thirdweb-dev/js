import type { Chain } from "../types";
export default {
  "chain": "FUCK",
  "chainId": 8387,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeibpyckp65pqjvrvqhdt26wqoqk55m6anshbfgyqnaemn6l34nlwya",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://wolfery.com",
  "name": "Dracones Financial Services",
  "nativeCurrency": {
    "name": "Functionally Universal Coin Kind",
    "symbol": "FUCK",
    "decimals": 18
  },
  "networkId": 8387,
  "rpc": [
    "https://dracones-financial-services.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8387.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dracones.net/"
  ],
  "shortName": "fuck",
  "slug": "dracones-financial-services",
  "testnet": false,
  "title": "The Dracones Mainnet"
} as const satisfies Chain;