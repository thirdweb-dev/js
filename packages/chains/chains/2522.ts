import type { Chain } from "../src/types";
export default {
  "chain": "FRAX",
  "chainId": 2522,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQLJk5G7zF8ZDxSxkRcpHqEqcifrJEhGmEKC6zwyPXWAw/fraxchain.png",
    "width": 512,
    "height": 512,
    "format": "PNG"
  },
  "infoURL": "https://testnet.frax.com",
  "name": "Fraxtal Testnet",
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "networkId": 2522,
  "redFlags": [],
  "rpc": [
    "https://2522.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.frax.com"
  ],
  "shortName": "fraxtal-testnet",
  "slip44": 1,
  "slug": "fraxtal-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;