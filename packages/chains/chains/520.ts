import type { Chain } from "../src/types";
export default {
  "chain": "XSC",
  "chainId": 520,
  "explorers": [
    {
      "name": "xscscan",
      "url": "https://xscscan.pub",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://xsc.pub/faucet"
  ],
  "icon": {
    "url": "ipfs://QmNmAFgQKkjofaBR5mhB5ygE1Gna36YBVsGkgZQxrwW85s",
    "width": 98,
    "height": 96,
    "format": "png"
  },
  "infoURL": "https://xsc.pub/",
  "name": "XT Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "XT Smart Chain Native Token",
    "symbol": "XT",
    "decimals": 18
  },
  "networkId": 1024,
  "rpc": [
    "https://xt-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://520.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://datarpc1.xsc.pub",
    "https://datarpc2.xsc.pub",
    "https://datarpc3.xsc.pub"
  ],
  "shortName": "xt",
  "slug": "xt-smart-chain",
  "testnet": false
} as const satisfies Chain;