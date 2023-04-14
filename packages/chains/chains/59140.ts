import type { Chain } from "../src/types";
export default {
  "name": "Linea Testnet",
  "title": "Linea Testnet",
  "chain": "ETH",
  "rpc": [
    "https://linea-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.goerli.linea.build"
  ],
  "faucets": [
    "https://faucetlink.to/goerli"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://linea.build",
  "shortName": "linea-testnet",
  "chainId": 59140,
  "networkId": 59140,
  "icon": {
    "url": "ipfs://QmP6rcphqMTeByPxomeYeR5XRPZaFpwGbZxHkGQKyao4Le",
    "width": 115,
    "height": 115,
    "format": "svg"
  },
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://goerli.hop.exchange/#/send?token=ETH&sourceNetwork=ethereum&destNetwork=linea"
      }
    ]
  },
  "explorers": [
    {
      "name": "Linea Testnet Explorer",
      "url": "https://explorer.goerli.linea.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmP6rcphqMTeByPxomeYeR5XRPZaFpwGbZxHkGQKyao4Le",
        "width": 115,
        "height": 115,
        "format": "svg"
      }
    }
  ],
  "status": "active",
  "testnet": true,
  "slug": "linea-testnet"
} as const satisfies Chain;