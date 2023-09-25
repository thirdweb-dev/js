import type { Chain } from "../src/types";
export default {
  "chainId": 3698,
  "chain": "SPC",
  "name": "SenjePowers Testnet",
  "rpc": [
    "https://senjepowers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.senjepowersscan.com"
  ],
  "slug": "senjepowers-testnet",
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
  "shortName": "SPCt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://testnet.senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;