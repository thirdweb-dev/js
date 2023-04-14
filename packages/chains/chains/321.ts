import type { Chain } from "../src/types";
export default {
  "name": "KCC Mainnet",
  "chain": "KCC",
  "rpc": [
    "https://kcc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.kcc.network",
    "https://kcc.mytokenpocket.vip",
    "https://public-rpc.blockpi.io/http/kcc"
  ],
  "faucets": [
    "https://faucet.kcc.io/",
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "KuCoin Token",
    "symbol": "KCS",
    "decimals": 18
  },
  "infoURL": "https://kcc.io",
  "shortName": "kcs",
  "chainId": 321,
  "networkId": 321,
  "slip44": 641,
  "explorers": [
    {
      "name": "KCC Explorer",
      "url": "https://explorer.kcc.io/en",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "kcc"
} as const satisfies Chain;