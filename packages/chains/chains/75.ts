import type { Chain } from "../src/types";
export default {
  "chainId": 75,
  "chain": "DSC",
  "name": "Decimal Smart Chain Mainnet",
  "rpc": [
    "https://decimal-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.decimalchain.com/web3/",
    "https://node1-mainnet.decimalchain.com/web3/",
    "https://node2-mainnet.decimalchain.com/web3/",
    "https://node3-mainnet.decimalchain.com/web3/",
    "https://node4-mainnet.decimalchain.com/web3/"
  ],
  "slug": "decimal-smart-chain",
  "icon": {
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "tDEL",
    "decimals": 18
  },
  "infoURL": "https://decimalchain.com",
  "shortName": "DSC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "DSC Explorer Mainnet",
      "url": "https://explorer.decimalchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;