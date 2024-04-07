import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1687,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://sepolia-testnet-explorer.mintchain.io",
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
  "name": "Mint Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1687,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://sepolia-testnet-bridge.mintchain.io"
      }
    ]
  },
  "rpc": [
    "https://1687.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-testnet-rpc.mintchain.io"
  ],
  "shortName": "mintsepoliatest",
  "slug": "mint-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;