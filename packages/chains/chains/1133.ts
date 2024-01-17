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
    "url": "ipfs://QmdR3YL9F95ajwVwfxAGoEzYwm9w7JNsPSfUPjSaQogVjK",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://meta.defichain.com",
  "name": "DeFiMetaChain Changi Testnet",
  "nativeCurrency": {
    "name": "DeFiChain Token",
    "symbol": "DFI",
    "decimals": 18
  },
  "networkId": 1133,
  "rpc": [
    "https://defimetachain-changi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1133.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dmc.mydefichain.com/changi",
    "https://testnet-dmc.mydefichain.com:20551"
  ],
  "shortName": "changi",
  "slug": "defimetachain-changi-testnet",
  "testnet": true
} as const satisfies Chain;