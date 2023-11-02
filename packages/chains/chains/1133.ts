import type { Chain } from "../src/types";
export default {
  "chain": "DFI",
  "chainId": 1133,
  "explorers": [
    {
      "name": "MetaScan",
      "url": "https://meta.defiscan.live",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://tc04.mydefichain.com/faucet"
  ],
  "icon": {
    "url": "ipfs://QmTFyaJFmkDQf35rVRzEf78nGThKAyUCW4BoRaKDi4nnV5",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://defichain.com",
  "name": "DeFiMetaChain",
  "nativeCurrency": {
    "name": "DeFiChain Token",
    "symbol": "DFI",
    "decimals": 18
  },
  "networkId": 1133,
  "rpc": [
    "https://defimetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1133.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-dmc.mydefichain.com:20551"
  ],
  "shortName": "changi",
  "slug": "defimetachain",
  "testnet": true
} as const satisfies Chain;