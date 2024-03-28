import type { Chain } from "../src/types";
export default {
  "chain": "OMAX Chain",
  "chainId": 311,
  "explorers": [
    {
      "name": "Omax Chain Explorer",
      "url": "https://omaxray.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmd7omPxrehSuxHHPMYd5Nr7nfrtjKdRJQEhDLfTb87w8G",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.omaxray.com/"
  ],
  "icon": {
    "url": "ipfs://Qmd7omPxrehSuxHHPMYd5Nr7nfrtjKdRJQEhDLfTb87w8G",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://www.omaxcoin.com/",
  "name": "Omax Mainnet",
  "nativeCurrency": {
    "name": "OMAX COIN",
    "symbol": "OMAX",
    "decimals": 18
  },
  "networkId": 311,
  "rpc": [
    "https://311.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainapi.omaxray.com"
  ],
  "shortName": "omax",
  "slug": "omax",
  "testnet": false
} as const satisfies Chain;