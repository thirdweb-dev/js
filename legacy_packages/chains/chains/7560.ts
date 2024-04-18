import type { Chain } from "../src/types";
export default {
  "chain": "Cyber",
  "chainId": 7560,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmP61yDNPv7fxY9ZzPs4CjQDbZLoKtF8eWWjszVYbwkabd",
    "width": 1000,
    "height": 1000,
    "format": "svg"
  },
  "infoURL": "https://cyber.co/",
  "name": "Cyber Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 7560,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "cyeth",
  "slug": "cyber",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;