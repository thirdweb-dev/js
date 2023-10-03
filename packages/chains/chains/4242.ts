import type { Chain } from "../src/types";
export default {
  "chain": "Nexi",
  "chainId": 4242,
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeifxqd7zel2m237kq5enavnh2s6cshaavswigogyvae2wevxy5k2ti",
    "width": 512,
    "height": 578,
    "format": "png"
  },
  "infoURL": "https://www.nexi.technology/",
  "name": "Nexi Mainnet",
  "nativeCurrency": {
    "name": "Nexi",
    "symbol": "NEXI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nexi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chain.nexi.technology/",
    "https://chain.nexilix.com",
    "https://chain.nexi.evmnode.online"
  ],
  "shortName": "nexi",
  "slug": "nexi",
  "testnet": false
} as const satisfies Chain;