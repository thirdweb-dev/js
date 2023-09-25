import type { Chain } from "../src/types";
export default {
  "chainId": 3699,
  "chain": "SPC",
  "name": "SenjePowers Mainnet",
  "rpc": [
    "https://senjepowers.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.senjepowersscan.com"
  ],
  "slug": "senjepowers",
  "icon": {
    "url": "ipfs://QmcpyTj4hUyHJZ2VmSdkXFpPpRcNKRP1VxMs7Cp1anymNy",
    "width": 504,
    "height": 495,
    "format": "png"
  },
  "faucets": [
    "https://faucet.senjepowersscan.com"
  ],
  "nativeCurrency": {
    "name": "SenjePowers",
    "symbol": "SPC",
    "decimals": 18
  },
  "infoURL": "https://senjepowersscan.com",
  "shortName": "SPCm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;