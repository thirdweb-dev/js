import type { Chain } from "../src/types";
export default {
  "chain": "AVE",
  "chainId": 8886,
  "explorers": [
    {
      "name": "Avenium Explorer Testnet",
      "url": "https://testnet.avescan.net",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmU5yJvjdeVGzNutn2U6wLWfHDGsDafLfZg7HRJ8ji3yfJ",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet-testnet.avenium.io"
  ],
  "icon": {
    "url": "ipfs://QmU5yJvjdeVGzNutn2U6wLWfHDGsDafLfZg7HRJ8ji3yfJ",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://avenium.io",
  "name": "Avenium Testnet",
  "nativeCurrency": {
    "name": "Ave Native Token",
    "symbol": "tAVE",
    "decimals": 18
  },
  "networkId": 8886,
  "rpc": [
    "https://8886.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eu-testnet.avenium.io/",
    "https://connect-testnet.avenium.io"
  ],
  "shortName": "tave",
  "slug": "avenium-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;