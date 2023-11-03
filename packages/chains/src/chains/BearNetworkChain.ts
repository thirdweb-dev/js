import type { Chain } from "../types";
export default {
  "chain": "BRNKC",
  "chainId": 641230,
  "explorers": [
    {
      "name": "brnkscan",
      "url": "https://brnkscan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "infoURL": "https://bearnetwork.net",
  "name": "Bear Network Chain Mainnet",
  "nativeCurrency": {
    "name": "Bear Network Chain Native Token",
    "symbol": "BRNKC",
    "decimals": 18
  },
  "networkId": 641230,
  "rpc": [
    "https://bear-network-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://641230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-mainnet.bearnetwork.net",
    "https://brnkc-mainnet1.bearnetwork.net"
  ],
  "shortName": "BRNKC",
  "slug": "bear-network-chain",
  "testnet": false
} as const satisfies Chain;