import type { Chain } from "../src/types";
export default {
  "chain": "FRAX",
  "chainId": 252,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQLJk5G7zF8ZDxSxkRcpHqEqcifrJEhGmEKC6zwyPXWAw/fraxchain.png",
    "width": 512,
    "height": 512,
    "format": "PNG"
  },
  "infoURL": "https://mainnet.frax.com",
  "name": "Fraxchain Mainnet",
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "networkId": 252,
  "redFlags": [],
  "rpc": [],
  "shortName": "fraxchain",
  "slug": "fraxchain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;