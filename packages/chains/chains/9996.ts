import type { Chain } from "../src/types";
export default {
  "name": "Mind Smart Chain Mainnet",
  "chain": "MIND",
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "rpc": [
    "https://mind-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-msc.mindchain.info/",
    "https://seednode.mindchain.info",
    "wss://seednode.mindchain.info/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "MIND",
    "decimals": 18
  },
  "infoURL": "https://mindchain.info",
  "shortName": "MIND",
  "chainId": 9996,
  "networkId": 9996,
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://mainnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mind-smart-chain"
} as const satisfies Chain;