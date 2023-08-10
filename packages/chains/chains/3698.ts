import type { Chain } from "../src/types";
export default {
  "name": "SenjePowers Testnet",
  "chain": "SPC",
  "icon": {
    "url": "ipfs://QmcpyTj4hUyHJZ2VmSdkXFpPpRcNKRP1VxMs7Cp1anymNy",
    "width": 504,
    "height": 495,
    "format": "png"
  },
  "rpc": [
    "https://senjepowers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.senjepowersscan.com"
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
  "shortName": "SPCt",
  "chainId": 3698,
  "networkId": 3698,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://testnet.senjepowersscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "senjepowers-testnet"
} as const satisfies Chain;