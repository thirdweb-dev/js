import type { Chain } from "../src/types";
export default {
  "chain": "crtr-testnet",
  "chainId": 37003,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorerl2new-crtr-testnet-mev0ni0xlx.t.conduit.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbYKZ1MuDa1hzwLGjdCZGapuhV7C9uyRDPJWD994qbocY/generic-icon.png",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbYKZ1MuDa1hzwLGjdCZGapuhV7C9uyRDPJWD994qbocY/generic-icon.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "crtr-testnet",
  "nativeCurrency": {
    "name": "CRTR",
    "symbol": "CRTR",
    "decimals": 18
  },
  "networkId": 37003,
  "parent": {
    "type": "L3",
    "chain": "eip155-1",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://37003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-crtr-testnet-mev0ni0xlx.t.conduit.xyz"
  ],
  "shortName": "crtr-testnet-mev0ni0xlx",
  "slug": "crtr-testnet",
  "testnet": true
} as const satisfies Chain;