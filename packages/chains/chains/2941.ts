import type { Chain } from "../src/types";
export default {
  "chain": "XEN",
  "chainId": 2941,
  "explorers": [
    {
      "name": "Xenon testnet Explorer",
      "url": "https://testnet.xenonchain.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://xfaucet.xenonchain.com"
  ],
  "icon": {
    "url": "ipfs://QmNSoxDnj6MV8mPJWiuzzLbATcbk5op11NTwMTdzcr272F",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://xenonchain.com",
  "name": "Xenon Chain Testnet",
  "nativeCurrency": {
    "name": "Xenon Testnet",
    "symbol": "tXEN",
    "decimals": 18
  },
  "networkId": 2941,
  "rpc": [
    "https://xenon-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2941.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-chain.xenonchain.com/",
    "https://testnet-dev.xenonchain.com/"
  ],
  "shortName": "xenon",
  "slip44": 1,
  "slug": "xenon-chain-testnet",
  "testnet": true
} as const satisfies Chain;