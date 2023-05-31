import type { Chain } from "../src/types";
export default {
  "name": "Siberium Network",
  "chain": "SBR",
  "rpc": [
    "https://siberium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "sbr",
  "chainId": 111111,
  "networkId": 111111,
  "icon": {
    "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 1",
      "url": "https://explorer.main.siberium.net",
      "icon": {
        "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
        "width": 512,
        "height": 512,
        "format": "svg"
      },
      "standard": "EIP3091"
    },
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "icon": {
        "url": "ipfs://QmYeMdWDZ1iaBFeSPorRyPi7RuSXTdDKTgW3rfnUf3W5ne",
        "width": 512,
        "height": 512,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "siberium-network"
} as const satisfies Chain;