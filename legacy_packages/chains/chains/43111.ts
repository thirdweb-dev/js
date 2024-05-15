import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 43111,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfP6GDn5eXFcpWuoiyWn5pjn6PYB7HQhRD8nSko1zR8KD",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://hemi.xyz",
  "name": "Hemi Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 43111,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "hemi",
  "slug": "hemi-network",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;