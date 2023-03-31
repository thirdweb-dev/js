import type { Chain } from "../src/types";
export default {
  "name": "Nexi Mainnet",
  "chain": "Nexi",
  "icon": {
    "url": "ipfs://bafybeifxqd7zel2m237kq5enavnh2s6cshaavswigogyvae2wevxy5k2ti",
    "width": 512,
    "height": 578,
    "format": "png"
  },
  "rpc": [
    "https://nexi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chain.nexi.technology/",
    "https://chain.nexilix.com",
    "https://chain.nexi.evmnode.online"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Nexi",
    "symbol": "NEXI",
    "decimals": 18
  },
  "infoURL": "https://www.nexi.technology/",
  "shortName": "nexi",
  "chainId": 4242,
  "networkId": 4242,
  "slip44": 2500,
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "nexi"
} as const satisfies Chain;