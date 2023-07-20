import type { Chain } from "../src/types";
export default {
  "name": "SenjePowers Mainnet",
  "chain": "SPC",
  "icon": {
    "url": "ipfs://QmcpyTj4hUyHJZ2VmSdkXFpPpRcNKRP1VxMs7Cp1anymNy",
    "width": 504,
    "height": 495,
    "format": "png"
  },
  "rpc": [
    "https://senjepowers.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.senjepowersscan.com"
  ],
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
  "chainId": 3699,
  "networkId": 3699,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "senjepowers"
} as const satisfies Chain;