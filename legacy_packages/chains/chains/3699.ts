import type { Chain } from "../src/types";
export default {
  "chain": "SPC",
  "chainId": 3699,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.senjepowersscan.com"
  ],
  "icon": {
    "url": "ipfs://QmcpyTj4hUyHJZ2VmSdkXFpPpRcNKRP1VxMs7Cp1anymNy",
    "width": 504,
    "height": 495,
    "format": "png"
  },
  "infoURL": "https://senjepowersscan.com",
  "name": "SenjePowers Mainnet",
  "nativeCurrency": {
    "name": "SenjePowers",
    "symbol": "SPC",
    "decimals": 18
  },
  "networkId": 3699,
  "rpc": [
    "https://3699.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.senjepowersscan.com"
  ],
  "shortName": "SPCm",
  "slug": "senjepowers",
  "testnet": false
} as const satisfies Chain;