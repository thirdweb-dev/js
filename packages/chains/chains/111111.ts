import type { Chain } from "../src/types";
export default {
  "chainId": 111111,
  "chain": "SBR",
  "name": "Siberium Network",
  "rpc": [
    "https://siberium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "slug": "siberium-network",
  "icon": {
    "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "sbr",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;