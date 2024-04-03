import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 62049,
  "explorers": [
    {
      "name": "optopia-testnet-scan",
      "url": "https://scan-testnet.optopia.ai",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreid3xv3zkuo2cygwt7vwm5c2aqjbyhy5qxn7xkc66ajhu2mjh2ybki",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreid3xv3zkuo2cygwt7vwm5c2aqjbyhy5qxn7xkc66ajhu2mjh2ybki",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://optopia.ai",
  "name": "OPTOPIA Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 62049,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge-testnet.optopia.ai"
      }
    ]
  },
  "rpc": [
    "https://62049.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.optopia.ai"
  ],
  "shortName": "OPTOPIA-Testnet",
  "slug": "optopia-testnet",
  "testnet": true
} as const satisfies Chain;