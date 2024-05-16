import type { Chain } from "../src/types";
export default {
  "chain": "TEL",
  "chainId": 2017,
  "explorers": [
    {
      "name": "telscan",
      "url": "https://telscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreih4obvrymfdqohzhiafhvpcy6zwqbgpfm26aahrv3qx2dtcei7hk4",
        "width": 79,
        "height": 80,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://telcoin.network/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreih4obvrymfdqohzhiafhvpcy6zwqbgpfm26aahrv3qx2dtcei7hk4",
    "width": 79,
    "height": 80,
    "format": "svg"
  },
  "infoURL": "https://telcoin.network",
  "name": "Adiri",
  "nativeCurrency": {
    "name": "Telcoin",
    "symbol": "TEL",
    "decimals": 18
  },
  "networkId": 2017,
  "rpc": [
    "https://2017.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.telcoin.network",
    "https://adiri.tel",
    "https://node1.telcoin.network",
    "https://node2.telcoin.network",
    "https://node3.telcoin.network",
    "https://node4.telcoin.network"
  ],
  "shortName": "tel",
  "slip44": 1,
  "slug": "adiri",
  "testnet": true,
  "title": "Telcoin Network Testnet"
} as const satisfies Chain;