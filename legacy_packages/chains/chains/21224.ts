import type { Chain } from "../src/types";
export default {
  "chain": "DCpay",
  "chainId": 21224,
  "explorers": [
    {
      "name": "DCpay Testnet Explorer",
      "url": "https://testnet.dcpay.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dcpay.io"
  ],
  "icon": {
    "url": "ipfs://QmezBwVepoegoCqb86idzPgvPxtaSuXzMLBGiiYfyTGTkc",
    "width": 458,
    "height": 468,
    "format": "png"
  },
  "infoURL": "https://dcpay.io",
  "name": "DCpay Testnet",
  "nativeCurrency": {
    "name": "DCP",
    "symbol": "DCP",
    "decimals": 18
  },
  "networkId": 21224,
  "rpc": [
    "https://21224.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.dcpay.io"
  ],
  "shortName": "DCPt",
  "slug": "dcpay-testnet",
  "testnet": true
} as const satisfies Chain;