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
  "name": "Fraxchain Testnet",
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "networkId": 2522,
  "redFlags": [],
  "rpc": [
    "https://fraxchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2522.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.frax.com"
  ],
  "shortName": "fraxchain-testnet",
  "slip44": 1,
  "slug": "fraxchain-testnet",
  "status": "active",
  "testnet": false
} as const satisfies Chain;