import type { Chain } from "../src/types";
export default {
  "chain": "SBR",
  "chainId": 111111,
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://siberium.net",
  "name": "Siberium Network",
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SIBR",
    "decimals": 18
  },
  "networkId": 111111,
  "rpc": [
    "https://111111.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "shortName": "sbr",
  "slug": "siberium-network",
  "testnet": false
} as const satisfies Chain;