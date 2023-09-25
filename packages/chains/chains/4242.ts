import type { Chain } from "../src/types";
export default {
  "chainId": 4242,
  "chain": "Nexi",
  "name": "Nexi Mainnet",
  "rpc": [
    "https://nexi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chain.nexi.technology/",
    "https://chain.nexilix.com",
    "https://chain.nexi.evmnode.online"
  ],
  "slug": "nexi",
  "icon": {
    "url": "ipfs://bafybeifxqd7zel2m237kq5enavnh2s6cshaavswigogyvae2wevxy5k2ti",
    "width": 512,
    "height": 578,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Nexi",
    "symbol": "NEXI",
    "decimals": 18
  },
  "infoURL": "https://www.nexi.technology/",
  "shortName": "nexi",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;