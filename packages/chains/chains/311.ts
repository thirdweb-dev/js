import type { Chain } from "../src/types";
export default {
  "chainId": 311,
  "chain": "OMAX Chain",
  "name": "Omax Mainnet",
  "rpc": [
    "https://omax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainapi.omaxray.com"
  ],
  "slug": "omax",
  "icon": {
    "url": "ipfs://Qmd7omPxrehSuxHHPMYd5Nr7nfrtjKdRJQEhDLfTb87w8G",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.omaxray.com/"
  ],
  "nativeCurrency": {
    "name": "OMAX COIN",
    "symbol": "OMAX",
    "decimals": 18
  },
  "infoURL": "https://www.omaxcoin.com/",
  "shortName": "omax",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Omax Chain Explorer",
      "url": "https://omaxray.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;