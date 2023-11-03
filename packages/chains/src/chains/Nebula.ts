import type { Chain } from "../types";
export default {
  "chain": "green-giddy-denebola",
  "chainId": 1482601649,
  "explorers": [
    {
      "name": "nebula",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfQkfmQuoUUUKwF1yCcrPEzFcWLaqNyiSv5YMcSj6zs74",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://nebulachain.io/",
  "name": "Nebula Mainnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1482601649,
  "rpc": [
    "https://nebula.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1482601649.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "shortName": "nebula-mainnet",
  "slug": "nebula",
  "testnet": false
} as const satisfies Chain;