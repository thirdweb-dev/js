import type { Chain } from "../src/types";
export default {
  "chainId": 1133,
  "chain": "DFI",
  "name": "DeFiMetaChain",
  "rpc": [
    "https://defimetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-dmc.mydefichain.com:20551"
  ],
  "slug": "defimetachain",
  "icon": {
    "url": "ipfs://QmTFyaJFmkDQf35rVRzEf78nGThKAyUCW4BoRaKDi4nnV5",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "faucets": [
    "http://tc04.mydefichain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "DeFiChain Token",
    "symbol": "DFI",
    "decimals": 18
  },
  "infoURL": "https://defichain.com",
  "shortName": "changi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "MetaScan",
      "url": "https://meta.defiscan.live",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;