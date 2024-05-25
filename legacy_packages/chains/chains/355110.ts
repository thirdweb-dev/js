import type { Chain } from "../src/types";
export default {
  "chain": "BFT",
  "chainId": 355110,
  "explorers": [
    {
      "name": "Bitfinity Mainnet Block Explorer",
      "url": "https://explorer.mainnet.bitfinity.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiczbhnoc5wpjikskmehexmg3xmqr4fchrny64db4wmk3lrygqik5e",
        "width": 796,
        "height": 129,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://bitfinity.network",
  "name": "Bitfinity Network Mainnet",
  "nativeCurrency": {
    "name": "Bitfinity Token",
    "symbol": "BFT",
    "decimals": 18
  },
  "networkId": 355110,
  "rpc": [
    "https://355110.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bitfinity.network"
  ],
  "shortName": "bitfinity-mainnet",
  "slug": "bitfinity-network",
  "testnet": false
} as const satisfies Chain;