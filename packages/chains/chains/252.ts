import type { Chain } from "../src/types";
export default {
  "chain": "FRAX",
  "chainId": 252,
  "explorers": [
    {
      "name": "fraxscan",
      "url": "https://fraxscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQLJk5G7zF8ZDxSxkRcpHqEqcifrJEhGmEKC6zwyPXWAw/fraxchain.png",
    "width": 512,
    "height": 512,
    "format": "PNG"
  },
  "infoURL": "https://mainnet.frax.com",
  "name": "Fraxtal",
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "networkId": 252,
  "redFlags": [],
  "rpc": [
    "https://252.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.frax.com"
  ],
  "shortName": "fraxtal",
  "slug": "fraxtal",
  "status": "active",
  "testnet": false
} as const satisfies Chain;