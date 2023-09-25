import type { Chain } from "../src/types";
export default {
  "chainId": 520,
  "chain": "XSC",
  "name": "XT Smart Chain Mainnet",
  "rpc": [
    "https://xt-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://datarpc1.xsc.pub",
    "https://datarpc2.xsc.pub",
    "https://datarpc3.xsc.pub"
  ],
  "slug": "xt-smart-chain",
  "icon": {
    "url": "ipfs://QmNmAFgQKkjofaBR5mhB5ygE1Gna36YBVsGkgZQxrwW85s",
    "width": 98,
    "height": 96,
    "format": "png"
  },
  "faucets": [
    "https://xsc.pub/faucet"
  ],
  "nativeCurrency": {
    "name": "XT Smart Chain Native Token",
    "symbol": "XT",
    "decimals": 18
  },
  "infoURL": "https://xsc.pub/",
  "shortName": "xt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "xscscan",
      "url": "https://xscscan.pub",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;