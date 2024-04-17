import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 62050,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreid3xv3zkuo2cygwt7vwm5c2aqjbyhy5qxn7xkc66ajhu2mjh2ybki",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://optopia.ai",
  "name": "Optopia Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 62050,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "Optopia",
  "slug": "optopia",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;