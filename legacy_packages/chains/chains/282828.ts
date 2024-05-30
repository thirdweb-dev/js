import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 282828,
  "explorers": [
    {
      "name": "zillscout",
      "url": "https://sepolia.zillnet.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfVmjLNiBh8KyCr9mwDZh34aEhhQ2LAjuP87DFxhfd9nn",
        "width": 264,
        "height": 264,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfVmjLNiBh8KyCr9mwDZh34aEhhQ2LAjuP87DFxhfd9nn",
    "width": 264,
    "height": 264,
    "format": "png"
  },
  "infoURL": "https://zillnet.io",
  "name": "Zillion Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 282828,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "rpc": [
    "https://282828.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.zillnet.io/rpc"
  ],
  "shortName": "zillsep",
  "slip44": 1,
  "slug": "zillion-sepolia-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;