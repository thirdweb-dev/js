import type { Chain } from "../src/types";
export default {
  "chain": "ZKFair",
  "chainId": 42766,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.zkfair.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVb682D4mUXkKNP28xxJDNgSYbDLvEc3kVYx7TQxEa6Cw",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVb682D4mUXkKNP28xxJDNgSYbDLvEc3kVYx7TQxEa6Cw",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://zkfair.io",
  "name": "ZKFair Mainnet",
  "nativeCurrency": {
    "name": "USDC Token",
    "symbol": "USDC",
    "decimals": 18
  },
  "networkId": 42766,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://wallet.zkfair.io"
      }
    ]
  },
  "rpc": [
    "https://42766.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zkfair.io"
  ],
  "shortName": "ZKFair-Mainnet",
  "slug": "zkfair",
  "testnet": false,
  "title": "ZKFair Mainnet"
} as const satisfies Chain;