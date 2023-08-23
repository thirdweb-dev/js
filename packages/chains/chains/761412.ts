import type { Chain } from "../src/types";
export default {
  "name": "Miexs Smartchain",
  "chain": "MiexsSmartchain",
  "icon": {
    "url": "ipfs://bafkreic6tcc6swh5kzljwqnswj6rlemcm7n6ra7xkgttwv5v3fv7ozj5zu",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "rpc": [
    "https://miexs-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.miexs.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Miexs Coin",
    "symbol": "MIX",
    "decimals": 18
  },
  "infoURL": "https://miexs.com",
  "shortName": "Miexs",
  "chainId": 761412,
  "networkId": 761412,
  "explorers": [
    {
      "name": "Miexs Smartchain Explorer",
      "url": "https://miexs.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "miexs-smartchain"
} as const satisfies Chain;