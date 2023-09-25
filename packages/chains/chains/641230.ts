import type { Chain } from "../src/types";
export default {
  "chainId": 641230,
  "chain": "BRNKC",
  "name": "Bear Network Chain Mainnet",
  "rpc": [
    "https://bear-network-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-mainnet.bearnetwork.net",
    "https://brnkc-mainnet1.bearnetwork.net"
  ],
  "slug": "bear-network-chain",
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bear Network Chain Native Token",
    "symbol": "BRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "shortName": "BRNKC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "brnkscan",
      "url": "https://brnkscan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;