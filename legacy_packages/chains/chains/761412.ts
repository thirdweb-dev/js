import type { Chain } from "../src/types";
export default {
  "chain": "MiexsSmartchain",
  "chainId": 761412,
  "explorers": [
    {
      "name": "Miexs Smartchain Explorer",
      "url": "https://miexs.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreic6tcc6swh5kzljwqnswj6rlemcm7n6ra7xkgttwv5v3fv7ozj5zu",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://miexs.com",
  "name": "Miexs Smartchain",
  "nativeCurrency": {
    "name": "Miexs Coin",
    "symbol": "MIX",
    "decimals": 18
  },
  "networkId": 761412,
  "rpc": [
    "https://761412.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.miexs.com"
  ],
  "shortName": "Miexs",
  "slug": "miexs-smartchain",
  "testnet": false
} as const satisfies Chain;