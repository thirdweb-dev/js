import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1686,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.mintchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQsYisbKkCTKoKG2YSVs94UGuWWMiBspirH4Af4FyZeZz",
        "width": 80,
        "height": 80,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQsYisbKkCTKoKG2YSVs94UGuWWMiBspirH4Af4FyZeZz",
    "width": 80,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://www.mintchain.io",
  "name": "Mint Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1686,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://testnet-bridge.mintchain.io"
      }
    ]
  },
  "rpc": [
    "https://mint-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1686.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.mintchain.io"
  ],
  "shortName": "minttest",
  "slug": "mint-testnet",
  "testnet": true
} as const satisfies Chain;