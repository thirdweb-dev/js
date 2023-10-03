import type { Chain } from "../src/types";
export default {
  "chain": "IVAR",
  "chainId": 16888,
  "explorers": [
    {
      "name": "ivarscan",
      "url": "https://testnet.ivarscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://tfaucet.ivarex.com/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmV8UmSwqGF2fxrqVEBTHbkyZueahqyYtkfH2RBF5pNysM",
    "width": 519,
    "height": 519,
    "format": "svg"
  },
  "infoURL": "https://ivarex.com",
  "name": "IVAR Chain Testnet",
  "nativeCurrency": {
    "name": "tIvar",
    "symbol": "tIVAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ivar-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.ivarex.com"
  ],
  "shortName": "tivar",
  "slug": "ivar-chain-testnet",
  "testnet": true
} as const satisfies Chain;