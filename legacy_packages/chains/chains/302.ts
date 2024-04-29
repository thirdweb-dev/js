import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 302,
  "explorers": [
    {
      "name": "zkCandy Block Explorer",
      "url": "https://sepolia.explorer.zkcandy.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreib5jsvl6kxn2qvv4giag3l3e54d2wolo2lqbgkhivxu4cpjzi77eq",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreib5jsvl6kxn2qvv4giag3l3e54d2wolo2lqbgkhivxu4cpjzi77eq",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://zkcandy.io/",
  "name": "zkCandy Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 302,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://sepolia.bridge.zkcandy.io/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://302.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.rpc.zkcandy.io"
  ],
  "shortName": "zkcandy-sepolia",
  "slug": "zkcandy-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;