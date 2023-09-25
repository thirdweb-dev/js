import type { Chain } from "../src/types";
export default {
  "chainId": 761412,
  "chain": "MiexsSmartchain",
  "name": "Miexs Smartchain",
  "rpc": [
    "https://miexs-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.miexs.com"
  ],
  "slug": "miexs-smartchain",
  "icon": {
    "url": "ipfs://bafkreic6tcc6swh5kzljwqnswj6rlemcm7n6ra7xkgttwv5v3fv7ozj5zu",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Miexs Coin",
    "symbol": "MIX",
    "decimals": 18
  },
  "infoURL": "https://miexs.com",
  "shortName": "Miexs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Miexs Smartchain Explorer",
      "url": "https://miexs.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;