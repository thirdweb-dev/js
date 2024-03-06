import type { Chain } from "../src/types";
export default {
  "chain": "haven1",
  "chainId": 810,
  "explorers": [
    {
      "name": "Haven1 Explorer",
      "url": "https://testnet-explorer.haven1.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreih4jq33lz2mjwvu62hmo2ptt277et5l6oqi5ejuyxv2dir2iohsai",
        "width": 128,
        "height": 128,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://www.haven1.org/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreih4jq33lz2mjwvu62hmo2ptt277et5l6oqi5ejuyxv2dir2iohsai",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://www.haven1.org",
  "name": "Haven1 Testnet",
  "nativeCurrency": {
    "name": "Haven1",
    "symbol": "H1",
    "decimals": 18
  },
  "networkId": 810,
  "rpc": [
    "https://810.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.haven1.org"
  ],
  "shortName": "h1",
  "slug": "haven1-testnet",
  "testnet": true
} as const satisfies Chain;