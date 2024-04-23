import type { Chain } from "../src/types";
export default {
  "chain": "IGC",
  "chainId": 1499,
  "explorers": [
    {
      "name": "IGC-Scan",
      "url": "https://igcscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeXuzaYXCDwHgQdpuE9L55JfEChzj11P73Ngrn8vDTE9T",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://idosgames.com/",
  "name": "iDos Games Chain Testnet",
  "nativeCurrency": {
    "name": "iDos Games Coin",
    "symbol": "IGC",
    "decimals": 18
  },
  "networkId": 1499,
  "rpc": [
    "https://1499.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.idos.games"
  ],
  "shortName": "IGC",
  "slug": "idos-games-chain-testnet",
  "testnet": true
} as const satisfies Chain;