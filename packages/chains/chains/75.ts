import type { Chain } from "../src/types";
export default {
  "chain": "DSC",
  "chainId": 75,
  "explorers": [
    {
      "name": "DSC Explorer Mainnet",
      "url": "https://explorer.decimalchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
        "width": 256,
        "height": 256,
        "format": "png"
      }
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
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://decimalchain.com",
  "name": "Decimal Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "DEL",
    "decimals": 18
  },
  "networkId": 75,
  "rpc": [
    "https://75.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.decimalchain.com/web3/",
    "https://node1-mainnet.decimalchain.com/web3/",
    "https://node2-mainnet.decimalchain.com/web3/",
    "https://node3-mainnet.decimalchain.com/web3/",
    "https://node4-mainnet.decimalchain.com/web3/"
  ],
  "shortName": "DSC",
  "slug": "decimal-smart-chain",
  "testnet": false
} as const satisfies Chain;