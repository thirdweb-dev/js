import type { Chain } from "../src/types";
export default {
  "name": "opBNB Mainnet",
  "chain": "opBNB",
  "rpc": [
    "https://opbnb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-mainnet-rpc.bnbchain.org"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains"
  ],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://opbnb.bnbchain.org/en",
  "shortName": "obnb",
  "chainId": 204,
  "networkId": 204,
  "slip44": 714,
  "explorers": [
    {
      "name": "opbnbscan",
      "url": "http://mainnet.opbnbscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "opbnb"
} as const satisfies Chain;