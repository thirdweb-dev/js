import type { Chain } from "../src/types";
export default {
  "chain": "MIND",
  "chainId": 9996,
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://mainnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "infoURL": "https://mindchain.info",
  "name": "Mind Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "tMIND",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mind-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-msc.mindchain.info/",
    "https://seednode.mindchain.info",
    "wss://seednode.mindchain.info/ws"
  ],
  "shortName": "MIND",
  "slug": "mind-smart-chain",
  "testnet": false
} as const satisfies Chain;