import type { Chain } from "../src/types";
export default {
  "chain": "Shido Testnet",
  "chainId": 9007,
  "explorers": [
    {
      "name": "Shidoblock Testnet Explorer",
      "url": "https://testnet.shidoscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreiatrf5pp7ywvrwvsv4otrex73u6v6bvhorqkxiop2hy2i572zjrba",
        "width": 1080,
        "height": 1080,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://testnet.shidoscan.com/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreiatrf5pp7ywvrwvsv4otrex73u6v6bvhorqkxiop2hy2i572zjrba",
    "width": 1080,
    "height": 1080,
    "format": "png"
  },
  "infoURL": "https://www.nexablock.io",
  "name": "Shido Testnet Block",
  "nativeCurrency": {
    "name": "Shido Testnet Token",
    "symbol": "SHIDO",
    "decimals": 18
  },
  "networkId": 9007,
  "rpc": [
    "https://9007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet-nodes.shidoscan.com",
    "wss://wss-testnet-nodes.shidoscan.com"
  ],
  "shortName": "ShidoTestnet",
  "slug": "shido-testnet-block",
  "testnet": true
} as const satisfies Chain;