import type { Chain } from "../src/types";
export default {
  "chain": "EthXY",
  "chainId": 979,
  "explorers": [
    {
      "name": "EthXY Testnet Network Explorer",
      "url": "https://explorer.testnet.ethxy.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihq3b3cqbg2ttlp4dfbgmirrwdw6bbpmmbr5wolddd2izbyqay4xq",
    "width": 480,
    "height": 480,
    "format": "png"
  },
  "infoURL": "https://ethxy.com",
  "name": "EthXY Testnet",
  "nativeCurrency": {
    "name": "Settled EthXY Token",
    "symbol": "SEXY",
    "decimals": 18
  },
  "networkId": 979,
  "rpc": [
    "https://979.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.ethxy.com"
  ],
  "shortName": "sexyTestnet",
  "slug": "ethxy-testnet",
  "testnet": true
} as const satisfies Chain;