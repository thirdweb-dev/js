import type { Chain } from "../src/types";
export default {
  "name": "DeFiMetaChain",
  "icon": {
    "url": "ipfs://QmTFyaJFmkDQf35rVRzEf78nGThKAyUCW4BoRaKDi4nnV5",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "chain": "DFI",
  "rpc": [
    "https://defimetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-dmc.mydefichain.com:20551"
  ],
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
  "chainId": 1133,
  "networkId": 1133,
  "explorers": [
    {
      "name": "MetaScan",
      "url": "https://meta.defiscan.live",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "defimetachain"
} as const satisfies Chain;