import type { Chain } from "../src/types";
export default {
  "chain": "SPC",
  "chainId": 3698,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://testnet.senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.senjepowersscan.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcpyTj4hUyHJZ2VmSdkXFpPpRcNKRP1VxMs7Cp1anymNy",
    "width": 504,
    "height": 495,
    "format": "png"
  },
  "infoURL": "https://senjepowersscan.com",
  "name": "SenjePowers Testnet",
  "nativeCurrency": {
    "name": "SenjePowers",
    "symbol": "SPC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://senjepowers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.senjepowersscan.com"
  ],
  "shortName": "SPCt",
  "slug": "senjepowers-testnet",
  "testnet": true
} as const satisfies Chain;