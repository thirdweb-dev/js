import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 43851,
  "explorers": [
    {
      "name": "ZKFair Testnet Info",
      "url": "https://testnet-scan.zkfair.io",
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
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmVb682D4mUXkKNP28xxJDNgSYbDLvEc3kVYx7TQxEa6Cw",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://zkfair.io",
  "name": "ZKFair Testnet",
  "nativeCurrency": {
    "name": "USDC Token",
    "symbol": "USDC",
    "decimals": 18
  },
  "networkId": 43851,
  "rpc": [
    "https://zkfair-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43851.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.zkfair.io"
  ],
  "shortName": "ZKFair-Testnet",
  "slip44": 1,
  "slug": "zkfair-testnet",
  "testnet": true
} as const satisfies Chain;