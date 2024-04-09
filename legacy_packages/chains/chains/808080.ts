import type { Chain } from "../src/types";
export default {
  "chain": "BIZT Testnet",
  "chainId": 808080,
  "explorers": [
    {
      "name": "BIZ Smart Chain Testnet Explorer",
      "url": "https://testnet.btscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmNnaDZRoMz9aoho35TGHBY5zD16P39cgPpw3z3jnkDHHB",
    "width": 104,
    "height": 104,
    "format": "png"
  },
  "infoURL": "https://www.biztoken.io/",
  "name": "BIZ Smart Chain Testnet",
  "nativeCurrency": {
    "name": "tBIZT",
    "symbol": "tBIZT",
    "decimals": 18
  },
  "networkId": 808080,
  "rpc": [
    "https://808080.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bizex.io/"
  ],
  "shortName": "bizt-testnet",
  "slip44": 1,
  "slug": "biz-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;